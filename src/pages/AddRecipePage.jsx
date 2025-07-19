import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCloudinaryUpload } from '../utils/useCloudinaryUpload';
import { useAutosave } from '../utils/useAutosave';
import { clearDraft } from '../feature/recipes/recipeSlice';
import { useNavigate } from 'react-router-dom';
import RecipeSuggestions from '../components/RecipeSuggestions';
import IngredientRecipeGenerator from '../components/IngredientRecipeGenerator';
import { FaSave, FaUndo, FaLightbulb, FaExclamationTriangle, FaBrain, FaMagic, FaClock } from 'react-icons/fa';
import PageContainer from '../components/PageContainer';

const categories = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Beverage',
];

const AddRecipePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [form, setForm] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    imageUrl: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const [aiGeneratedInfo, setAiGeneratedInfo] = useState(null);
  
  const { upload, uploading, error: uploadError, url: uploadedUrl } = useCloudinaryUpload('unsigned_upload');
  const { manualSave, hasUnsavedChanges, getLastSavedTime, draft } = useAutosave(form);

  // Check for prefill data from suggestions and AI generation
  useEffect(() => {
    if (location.state) {
      const { 
        prefillCategory, 
        prefillName, 
        prefillIngredients, 
        prefillInstructions, 
        prefillCookTime,
        aiGenerated,
        cookingTime,
        difficulty,
        reasoning,
        generatedRecipe
      } = location.state;

      setForm(prev => ({
        ...prev,
        name: prefillName || prev.name,
        ingredients: prefillIngredients || prev.ingredients,
        instructions: prefillInstructions || prev.instructions,
        category: prefillCategory || prev.category,
        cookTime: prefillCookTime || prev.cookTime,
      }));

      // Set AI generation info if available
      if (aiGenerated) {
        setAiGeneratedInfo({
          cookingTime,
          difficulty,
          reasoning,
          generatedRecipe
        });
      }
    }
  }, [location.state]);

  // Check for existing draft on mount
  useEffect(() => {
    if (draft.name || draft.ingredients || draft.instructions) {
      setShowDraftRestore(true);
    }
  }, [draft]);

  // Update imageUrl when upload completes
  useEffect(() => {
    if (uploadedUrl) {
      setForm((f) => ({ ...f, imageUrl: uploadedUrl }));
    }
  }, [uploadedUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await upload(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await upload(e.dataTransfer.files[0]);
    }
  };

  const handleRestoreDraft = () => {
    setForm({
      name: draft.name || '',
      ingredients: draft.ingredients || '',
      instructions: draft.instructions || '',
      category: draft.category || '',
      prepTime: draft.prepTime || '',
      cookTime: draft.cookTime || '',
      servings: draft.servings || '',
      imageUrl: draft.imageUrl || '',
    });
    setShowDraftRestore(false);
  };

  const handleDiscardDraft = () => {
    dispatch(clearDraft());
    setShowDraftRestore(false);
  };

  const handleManualSave = () => {
    manualSave(form);
    setSuccess('Draft saved manually!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (!user) {
      setError('You must be logged in to add a recipe.');
      return;
    }
    
    if (!form.name || !form.ingredients || !form.instructions) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      await addDoc(collection(db, 'recipes'), {
        title: form.name,
        ingredients: form.ingredients,
        instructions: form.instructions,
        category: form.category,
        prepTime: form.prepTime,
        cookTime: form.cookTime,
        servings: form.servings,
        imageUrl: form.imageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
        aiGenerated: aiGeneratedInfo ? true : false,
        aiGeneratedInfo: aiGeneratedInfo || null,
      });
      
      // Clear draft after successful save
      dispatch(clearDraft());
      
      setSuccess('Recipe added successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError('Failed to add recipe.');
    }
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-800">New Recipe</h1>
                  {aiGeneratedInfo && (
                    <span className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaBrain className="h-4 w-4" />
                      <span>AI Generated</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {hasUnsavedChanges && (
                    <div className="flex items-center space-x-1 text-orange-600 text-sm">
                      <FaExclamationTriangle className="h-4 w-4" />
                      <span>Unsaved changes</span>
                    </div>
                  )}
                  {getLastSavedTime() && (
                    <div className="text-xs text-gray-500">
                      Last saved: {getLastSavedTime()}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Generated Info */}
              {aiGeneratedInfo && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBrain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">AI Generated Recipe</span>
                  </div>
                  {aiGeneratedInfo.reasoning && (
                    <p className="text-sm text-purple-700 mb-2">
                      💡 {aiGeneratedInfo.reasoning}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-purple-600">
                    {aiGeneratedInfo.cookingTime && (
                      <div className="flex items-center space-x-1">
                        <FaClock className="h-3 w-3" />
                        <span>{aiGeneratedInfo.cookingTime}</span>
                      </div>
                    )}
                    {aiGeneratedInfo.difficulty && (
                      <div className="flex items-center space-x-1">
                        <FaMagic className="h-3 w-3" />
                        <span>{aiGeneratedInfo.difficulty}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Draft Restore Alert */}
              {showDraftRestore && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaUndo className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        You have a saved draft. Would you like to restore it?
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRestoreDraft}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Restore
                      </button>
                      <button
                        onClick={handleDiscardDraft}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-medium mb-1">Recipe Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-md bg-red-50 border-none p-3 placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                    placeholder="Enter recipe name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-1">Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    className="w-full rounded-md bg-red-50 border-none p-3 min-h-[80px] placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                    placeholder="List ingredients with quantities"
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-1">Instructions</label>
                  <textarea
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    className="w-full rounded-md bg-red-50 border-none p-3 min-h-[80px] placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                    placeholder="Step-by-step cooking instructions"
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-md bg-red-50 border-none p-3 text-gray-700 focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Preparation Time (minutes)</label>
                    <input
                      type="number"
                      name="prepTime"
                      value={form.prepTime}
                      onChange={handleChange}
                      className="w-full rounded-md bg-red-50 border-none p-3 placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                      placeholder="e.g. 30"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Cooking Time (minutes)</label>
                    <input
                      type="number"
                      name="cookTime"
                      value={form.cookTime}
                      onChange={handleChange}
                      className="w-full rounded-md bg-red-50 border-none p-3 placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                      placeholder="e.g. 45"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Servings</label>
                    <input
                      type="number"
                      name="servings"
                      value={form.servings}
                      onChange={handleChange}
                      className="w-full rounded-md bg-red-50 border-none p-3 placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                      placeholder="e.g. 4"
                    />
                  </div>
                </div>
                
                {/* Image Upload */}
                <div
                  className="border-2 border-dashed border-red-200 rounded-xl p-6 text-center bg-white"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="font-semibold mb-2">Upload Photo</div>
                  <div className="text-sm text-gray-500 mb-4">Drag and drop or click to upload a photo of your dish</div>
                  <input
                    type="file"
                    accept="image/*"
                    id="recipe-photo"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition"
                    onClick={() => document.getElementById('recipe-photo').click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  {form.imageUrl && (
                    <div className="mt-4 flex justify-center">
                      <img src={form.imageUrl} alt="Recipe" className="h-24 rounded-lg object-cover" />
                    </div>
                  )}
                  {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}
                </div>
                
                {success && <div className="text-green-600 font-medium text-center">{success}</div>}
                {error && <div className="text-red-600 font-medium text-center">{error}</div>}
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleManualSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition"
                  >
                    <FaSave className="h-4 w-4" />
                    <span>Save Draft</span>
                  </button>
                  
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold text-lg transition"
                    disabled={uploading}
                  >
                    Save Recipe
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* AI Recipe Generator */}
              <IngredientRecipeGenerator />
              
              {/* AI Suggestions */}
              <div>
                <div className="mb-4">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition"
                  >
                    <FaBrain className="h-5 w-5" />
                    <span>{showSuggestions ? 'Hide' : 'Show'} AI Suggestions</span>
                  </button>
                </div>
                
                {showSuggestions && <RecipeSuggestions />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AddRecipePage; 