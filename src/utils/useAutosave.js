import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDraft, saveDraft, loadDraft } from '../feature/recipes/recipeSlice';

export const useAutosave = (formData, formId = 'recipe') => {
  const dispatch = useDispatch();
  const { autosaveEnabled, autosaveInterval, draft } = useSelector(state => state.recipes);
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('recipeDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        dispatch(loadDraft(parsedDraft));
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem('recipeDraft');
      }
    }
  }, [dispatch]);

  // Debounced autosave function
  const debouncedSave = useCallback((data) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (autosaveEnabled && data && Object.keys(data).length > 0) {
        const hasChanges = JSON.stringify(data) !== JSON.stringify(lastSavedRef.current);
        
        if (hasChanges) {
          dispatch(saveDraft(data));
          lastSavedRef.current = JSON.stringify(data);
          
          // Show autosave notification
          const notification = document.createElement('div');
          notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
          notification.textContent = 'Draft saved automatically';
          document.body.appendChild(notification);
          
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
          }, 2000);
        }
      }
    }, autosaveInterval);
  }, [dispatch, autosaveEnabled, autosaveInterval]);

  // Update draft when form data changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      dispatch(updateDraft(formData));
      debouncedSave(formData);
    }
  }, [formData, debouncedSave, dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Manual save function
  const manualSave = useCallback((data) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch(saveDraft(data || formData));
    lastSavedRef.current = JSON.stringify(data || formData);
  }, [dispatch, formData]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = draft.isDirty;

  // Get last saved time
  const getLastSavedTime = () => {
    if (draft.lastSaved) {
      return new Date(draft.lastSaved).toLocaleTimeString();
    }
    return null;
  };

  return {
    manualSave,
    hasUnsavedChanges,
    getLastSavedTime,
    draft
  };
}; 