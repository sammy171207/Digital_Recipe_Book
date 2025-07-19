import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import geminiService from '../../utils/geminiService';

// Async thunk for fetching AI recipe suggestions using Gemini
export const fetchRecipeSuggestions = createAsyncThunk(
  'recipes/fetchSuggestions',
  async (userPreferences, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      
      if (!user) {
        return [];
      }

      // Get user's recipes to understand preferences
      const recipesRef = collection(db, 'recipes');
      const q = query(
        recipesRef,
        where('userId', '==', user.uid)
        // Removed orderBy to avoid composite index requirement
        // We'll sort the results in JavaScript instead
      );
      
      const querySnapshot = await getDocs(q);
      const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by createdAt in JavaScript (newest first)
      recipes.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return bTime - aTime;
      });

      // Limit to 50 most recent recipes for analysis
      const recentRecipes = recipes.slice(0, 50);

      // Use Gemini AI for intelligent suggestions
      const suggestions = await geminiService.generateRecipeSuggestions(recentRecipes, userPreferences);
      
      return suggestions;
    } catch (error) {
      console.error('Error fetching recipe suggestions:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for generating recipe from ingredients
export const generateRecipeFromIngredients = createAsyncThunk(
  'recipes/generateFromIngredients',
  async (ingredients, { rejectWithValue }) => {
    try {
      const recipe = await geminiService.generateRecipeFromIngredients(ingredients);
      return recipe;
    } catch (error) {
      console.error('Error generating recipe from ingredients:', error);
      return rejectWithValue(error.message);
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    draft: {
      name: '',
      ingredients: '',
      instructions: '',
      category: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      imageUrl: '',
      lastSaved: null,
      isDirty: false
    },
    suggestions: [],
    suggestionsLoading: false,
    suggestionsError: null,
    generatedRecipe: null,
    generatedRecipeLoading: false,
    generatedRecipeError: null,
    autosaveEnabled: true,
    autosaveInterval: 30000, // 30 seconds
  },
  reducers: {
    // Autosave draft actions
    updateDraft: (state, action) => {
      state.draft = { ...state.draft, ...action.payload, isDirty: true };
    },
    saveDraft: (state, action) => {
      state.draft = { 
        ...state.draft, 
        ...action.payload, 
        lastSaved: new Date().toISOString(),
        isDirty: false 
      };
      // Save to localStorage
      localStorage.setItem('recipeDraft', JSON.stringify(state.draft));
    },
    loadDraft: (state, action) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = {
        name: '',
        ingredients: '',
        instructions: '',
        category: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        imageUrl: '',
        lastSaved: null,
        isDirty: false
      };
      localStorage.removeItem('recipeDraft');
    },
    setAutosaveEnabled: (state, action) => {
      state.autosaveEnabled = action.payload;
    },
    setAutosaveInterval: (state, action) => {
      state.autosaveInterval = action.payload;
    },
    clearGeneratedRecipe: (state) => {
      state.generatedRecipe = null;
      state.generatedRecipeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Recipe suggestions
      .addCase(fetchRecipeSuggestions.pending, (state) => {
        state.suggestionsLoading = true;
        state.suggestionsError = null;
      })
      .addCase(fetchRecipeSuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchRecipeSuggestions.rejected, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestionsError = action.payload;
      })
      // Generated recipe from ingredients
      .addCase(generateRecipeFromIngredients.pending, (state) => {
        state.generatedRecipeLoading = true;
        state.generatedRecipeError = null;
      })
      .addCase(generateRecipeFromIngredients.fulfilled, (state, action) => {
        state.generatedRecipeLoading = false;
        state.generatedRecipe = action.payload;
      })
      .addCase(generateRecipeFromIngredients.rejected, (state, action) => {
        state.generatedRecipeLoading = false;
        state.generatedRecipeError = action.payload;
      });
  },
});

export const { 
  updateDraft, 
  saveDraft, 
  loadDraft, 
  clearDraft, 
  setAutosaveEnabled, 
  setAutosaveInterval,
  clearGeneratedRecipe
} = recipeSlice.actions;

export default recipeSlice.reducer; 