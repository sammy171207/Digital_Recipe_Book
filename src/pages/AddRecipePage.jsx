import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCloudinaryUpload } from '../utils/useCloudinaryUpload';
import { useNavigate } from 'react-router-dom';

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
  const { upload, uploading, error: uploadError, url: uploadedUrl } = useCloudinaryUpload('unsigned_upload');

  // Update imageUrl when upload completes
  React.useEffect(() => {
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
      });
      setSuccess('Recipe added successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError('Failed to add recipe.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7f4] py-10 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">New Recipe</h1>
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
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold text-lg mt-4 transition"
            disabled={uploading}
          >
            Save Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipePage; 