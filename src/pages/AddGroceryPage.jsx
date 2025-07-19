import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaPlus, FaTrash, FaSave, FaShoppingCart } from 'react-icons/fa';

const AddGroceryPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([
    { name: '', quantity: '', unit: '', category: 'General', completed: false }
  ]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'General',
    'Produce',
    'Dairy',
    'Meat',
    'Pantry',
    'Frozen',
    'Beverages',
    'Snacks',
    'Bakery',
    'Household',
    'Other'
  ];

  const units = [
    'pcs',
    'kg',
    'g',
    'lbs',
    'oz',
    'l',
    'ml',
    'cups',
    'tbsp',
    'tsp',
    'bunch',
    'pack',
    'box',
    'can',
    'bottle',
    'bag'
  ];

  const addItem = () => {
    setItems([...items, { name: '', quantity: '', unit: '', category: 'General', completed: false }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const toggleItemComplete = (index) => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!user) {
      setError('You must be logged in to create a grocery list.');
      return;
    }

    if (!listName.trim()) {
      setError('Please enter a list name.');
      return;
    }

    const validItems = items.filter(item => item.name.trim() !== '');
    if (validItems.length === 0) {
      setError('Please add at least one item to your grocery list.');
      return;
    }

    try {
      await addDoc(collection(db, 'groceryLists'), {
        name: listName.trim(),
        items: validItems,
        userId: user.uid,
        createdAt: serverTimestamp(),
        completed: false,
        totalItems: validItems.length,
        completedItems: 0
      });

      setSuccess('Grocery list created successfully!');
      setTimeout(() => navigate('/grocery-lists'), 1200);
    } catch (err) {
      setError('Failed to create grocery list.');
      console.error('Error creating grocery list:', err);
    }
  };

  const completedItems = items.filter(item => item.completed).length;
  const totalItems = items.filter(item => item.name.trim() !== '').length;

  return (
    <div className="min-h-screen bg-[#fdf7f4] py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaShoppingCart className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Create Grocery List</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* List Name */}
            <div>
              <label className="block font-medium mb-2">List Name</label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-full rounded-md bg-red-50 border-none p-3 placeholder:text-red-300 focus:ring-2 focus:ring-orange-400"
                placeholder="e.g., Weekly Groceries, Party Shopping, etc."
                required
              />
            </div>

            {/* Progress Bar */}
            {totalItems > 0 && (
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">List Progress</span>
                  <span className="text-sm text-gray-500">{completedItems}/{totalItems} items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Items List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block font-medium">Items</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItemComplete(index)}
                      className="h-5 w-5 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                    />

                    {/* Item Name */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className={`w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                          item.completed ? 'line-through text-gray-500 bg-gray-50' : ''
                        }`}
                        placeholder="Item name"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="w-20">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className={`w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-center ${
                          item.completed ? 'line-through text-gray-500 bg-gray-50' : ''
                        }`}
                        placeholder="Qty"
                      />
                    </div>

                    {/* Unit */}
                    <div className="w-24">
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className={`w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm ${
                          item.completed ? 'line-through text-gray-500 bg-gray-50' : ''
                        }`}
                      >
                        <option value="">Unit</option>
                        {units.map((unit) => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div className="w-32">
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        className={`w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm ${
                          item.completed ? 'line-through text-gray-500 bg-gray-50' : ''
                        }`}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Remove Button */}
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            {totalItems > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">List Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Items:</span>
                    <span className="ml-2 font-medium">{totalItems}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Completed:</span>
                    <span className="ml-2 font-medium text-green-600">{completedItems}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <span className="ml-2 font-medium text-orange-600">{totalItems - completedItems}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <span className="ml-2 font-medium">{totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%</span>
                  </div>
                </div>
              </div>
            )}

            {success && <div className="text-green-600 font-medium text-center">{success}</div>}
            {error && <div className="text-red-600 font-medium text-center">{error}</div>}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/grocery-lists')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold text-lg transition"
              >
                <FaSave className="h-5 w-5" />
                <span>Create List</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroceryPage; 