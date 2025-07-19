import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaShoppingCart, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const ViewGroceryListPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [groceryLists, setGroceryLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const fetchGroceryLists = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const listsSnap = await getDocs(
        query(
          collection(db, 'groceryLists'),
          where('userId', '==', user.uid)
        )
      );
      const lists = listsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroceryLists(lists);
    } catch (error) {
      console.error('Error fetching grocery lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceryLists();
  }, [user]);

  // Refresh data when component comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchGroceryLists();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const toggleItemComplete = async (listId, itemIndex) => {
    try {
      const list = groceryLists.find(l => l.id === listId);
      if (!list) return;

      const updatedItems = [...list.items];
      updatedItems[itemIndex].completed = !updatedItems[itemIndex].completed;
      
      const completedItems = updatedItems.filter(item => item.completed).length;
      
      await updateDoc(doc(db, 'groceryLists', listId), {
        items: updatedItems,
        completedItems: completedItems
      });

      // Update local state
      setGroceryLists(prev => prev.map(l => 
        l.id === listId 
          ? { ...l, items: updatedItems, completedItems }
          : l
      ));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteList = async () => {
    if (!listToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'groceryLists', listToDelete.id));
      setGroceryLists(prev => prev.filter(l => l.id !== listToDelete.id));
      setShowDeleteModal(false);
      setListToDelete(null);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (list) => {
    if (!list.totalItems || list.totalItems === 0) return 0;
    return Math.round((list.completedItems / list.totalItems) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf7f4] flex items-center justify-center">
        <div className="text-xl">Please log in to view your grocery lists.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf7f4] py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FaShoppingCart className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">My Grocery Lists</h1>
          </div>
          <button
            onClick={() => navigate('/add-grocery')}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition"
          >
            <FaPlus className="h-4 w-4" />
            <span>New List</span>
          </button>
        </div>

        {/* Lists Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : groceryLists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">No grocery lists yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first grocery list</p>
            <button
              onClick={() => navigate('/add-grocery')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Create Your First List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groceryLists.map((list) => (
              <div key={list.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {list.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedList(selectedList?.id === list.id ? null : list)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/edit-grocery/${list.id}`)}
                        className="text-orange-500 hover:text-orange-700 p-1"
                        title="Edit List"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setListToDelete(list);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete List"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">
                        {list.completedItems || 0}/{list.totalItems || 0} items
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getProgressPercentage(list))}`}
                        style={{ width: `${getProgressPercentage(list)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Created: {formatDate(list.createdAt)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      list.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {list.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                {selectedList?.id === list.id && (
                  <div className="p-6 bg-gray-50">
                    <h4 className="font-medium mb-3">Items</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {list.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded border">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleItemComplete(list.id, index)}
                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                          />
                          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Grocery List</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{listToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setListToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteList}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGroceryListPage; 