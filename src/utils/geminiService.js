// Gemini AI Service for Recipe Suggestions
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_API_URL;
  }

  async generateRecipeSuggestions(userRecipes, userPreferences = {}) {
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Falling back to basic suggestions.');
      return this.generateBasicSuggestions(userRecipes);
    }

    try {
      // Analyze user's recipe history
      const recipeAnalysis = this.analyzeUserRecipes(userRecipes);
      
      // Create prompt for Gemini
      const prompt = this.createSuggestionPrompt(recipeAnalysis, userPreferences);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const suggestions = this.parseGeminiResponse(data);
      
      return suggestions;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback to basic suggestions
      return this.generateBasicSuggestions(userRecipes);
    }
  }

  analyzeUserRecipes(recipes) {
    const analysis = {
      totalRecipes: recipes.length,
      categories: {},
      ingredients: {},
      cookingTimes: [],
      difficulty: 'beginner',
      cuisineTypes: {},
      seasonalPreferences: {}
    };

    recipes.forEach(recipe => {
      // Category analysis
      if (recipe.category) {
        analysis.categories[recipe.category] = (analysis.categories[recipe.category] || 0) + 1;
      }

      // Ingredient analysis
      if (recipe.ingredients) {
        const ingredients = recipe.ingredients.toLowerCase()
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 2);
        
        ingredients.forEach(ingredient => {
          analysis.ingredients[ingredient] = (analysis.ingredients[ingredient] || 0) + 1;
        });
      }

      // Cooking time analysis
      if (recipe.cookTime) {
        analysis.cookingTimes.push(parseInt(recipe.cookTime) || 0);
      }

      // Seasonal analysis (based on current month)
      const currentMonth = new Date().getMonth();
      const seasonalIngredients = this.getSeasonalIngredients(currentMonth);
      if (recipe.ingredients) {
        seasonalIngredients.forEach(seasonalIngredient => {
          if (recipe.ingredients.toLowerCase().includes(seasonalIngredient)) {
            analysis.seasonalPreferences[seasonalIngredient] = true;
          }
        });
      }
    });

    // Calculate average cooking time
    if (analysis.cookingTimes.length > 0) {
      analysis.avgCookingTime = Math.round(
        analysis.cookingTimes.reduce((a, b) => a + b, 0) / analysis.cookingTimes.length
      );
    }

    // Determine difficulty level
    if (analysis.totalRecipes > 20) analysis.difficulty = 'expert';
    else if (analysis.totalRecipes > 10) analysis.difficulty = 'intermediate';
    else analysis.difficulty = 'beginner';

    return analysis;
  }

  createSuggestionPrompt(analysis, preferences) {
    const currentMonth = new Date().getMonth();
    const season = this.getSeason(currentMonth);
    
    return `You are a culinary AI assistant helping a user discover new recipes. 

USER PROFILE:
- Total recipes created: ${analysis.totalRecipes}
- Experience level: ${analysis.difficulty}
- Favorite categories: ${Object.keys(analysis.categories).slice(0, 3).join(', ')}
- Most used ingredients: ${Object.keys(analysis.ingredients).slice(0, 5).join(', ')}
- Average cooking time: ${analysis.avgCookingTime || 'N/A'} minutes
- Current season: ${season}
- Seasonal preferences: ${Object.keys(analysis.seasonalPreferences).join(', ')}

TASK:
Generate 6 personalized recipe suggestions for this user. Each suggestion should include:
1. A creative recipe title
2. Brief description (1-2 sentences)
3. Suggested category (Breakfast, Lunch, Dinner, Dessert, Snack, Beverage)
4. Estimated cooking time
5. Difficulty level (beginner, intermediate, expert)
6. Why this recipe would appeal to this user (based on their preferences)
7. Seasonal relevance if applicable

FORMAT YOUR RESPONSE AS JSON:
{
  "suggestions": [
    {
      "id": "suggestion-1",
      "title": "Recipe Title",
      "description": "Brief description",
      "category": "Category",
      "cookingTime": "30-45 minutes",
      "difficulty": "beginner",
      "reasoning": "Why this user would like it",
      "seasonal": "spring/summer/fall/winter or null",
      "type": "ai_generated"
    }
  ]
}

Make suggestions diverse, creative, and tailored to the user's cooking style and preferences. Include both familiar comfort foods and exciting new dishes to try.`;
  }

  parseGeminiResponse(data) {
    try {
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.suggestions || [];
      }
      
      // Fallback parsing if JSON extraction fails
      return this.parseTextResponse(text);
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return [];
    }
  }

  parseTextResponse(text) {
    // Fallback parsing for non-JSON responses
    const suggestions = [];
    const lines = text.split('\n');
    let currentSuggestion = {};

    lines.forEach(line => {
      if (line.includes('Title:') || line.includes('Recipe:')) {
        if (Object.keys(currentSuggestion).length > 0) {
          suggestions.push(currentSuggestion);
        }
        currentSuggestion = {
          id: `suggestion-${suggestions.length + 1}`,
          title: line.split(':')[1]?.trim() || 'New Recipe',
          type: 'ai_generated'
        };
      } else if (line.includes('Description:')) {
        currentSuggestion.description = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Category:')) {
        currentSuggestion.category = line.split(':')[1]?.trim() || 'General';
      }
    });

    if (Object.keys(currentSuggestion).length > 0) {
      suggestions.push(currentSuggestion);
    }

    return suggestions;
  }

  generateBasicSuggestions(recipes) {
    // Fallback suggestions when Gemini is not available
    const suggestions = [];
    
    // Category-based suggestions
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];
    categories.forEach(category => {
      suggestions.push({
        id: `basic-${category}`,
        title: `${category} Recipe Ideas`,
        description: `Try creating a new ${category.toLowerCase()} recipe`,
        category: category,
        type: 'basic',
        confidence: 0.6
      });
    });

    return suggestions.slice(0, 6);
  }

  getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  getSeasonalIngredients(month) {
    const seasonal = {
      0: ['citrus', 'winter squash', 'root vegetables'], // January
      1: ['citrus', 'winter greens', 'chocolate'], // February
      2: ['asparagus', 'peas', 'spring greens'], // March
      3: ['asparagus', 'spring onions', 'eggs'], // April
      4: ['strawberries', 'peas', 'spring vegetables'], // May
      5: ['berries', 'zucchini', 'fresh herbs'], // June
      6: ['tomatoes', 'corn', 'summer squash'], // July
      7: ['tomatoes', 'peppers', 'melons'], // August
      8: ['apples', 'pumpkins', 'squash'], // September
      9: ['pumpkins', 'apples', 'root vegetables'], // October
      10: ['pumpkins', 'squash', 'cranberries'], // November
      11: ['citrus', 'winter squash', 'nuts'] // December
    };
    return seasonal[month] || [];
  }

  async generateRecipeFromIngredients(ingredients) {
    if (!this.apiKey) {
      return {
        title: 'Recipe with Available Ingredients',
        description: 'Create a recipe using the ingredients you have',
        type: 'ingredient_based'
      };
    }

    try {
      const prompt = `Create a recipe using these ingredients: ${ingredients.join(', ')}. 
      
      Provide a JSON response with:
      {
        "title": "Recipe Title",
        "description": "Brief description",
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": ["step1", "step2"],
        "cookingTime": "30 minutes",
        "difficulty": "beginner"
      }`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        title: 'Recipe with Available Ingredients',
        description: 'Create a recipe using the ingredients you have',
        type: 'ingredient_based'
      };
    } catch (error) {
      console.error('Error generating recipe from ingredients:', error);
      return {
        title: 'Recipe with Available Ingredients',
        description: 'Create a recipe using the ingredients you have',
        type: 'ingredient_based'
      };
    }
  }
}

export default new GeminiService(); 