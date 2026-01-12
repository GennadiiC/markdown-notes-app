import { createContext, useContext, useReducer, useEffect } from 'react';
import { notesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotesContext = createContext(null);

// Notes reducer
const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        activeNoteId: state.activeNoteId === action.payload ? null : state.activeNoteId,
      };
    case 'SET_ACTIVE_NOTE':
      return {
        ...state,
        activeNoteId: action.payload,
      };
    case 'LOADING':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_NOTES':
      return {
        ...state,
        notes: [],
        activeNoteId: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  notes: [],
  activeNoteId: null,
  loading: false,
  error: null,
};

export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { token, isAuthenticated } = useAuth();

  // Fetch notes when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchNotes();
    } else {
      dispatch({ type: 'CLEAR_NOTES' });
    }
  }, [isAuthenticated, token]);

  // Fetch all notes
  const fetchNotes = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await notesAPI.getAll(token);
      dispatch({ type: 'SET_NOTES', payload: response.notes });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      console.error('Failed to fetch notes:', error);
    }
  };

  // Create a new note
  const createNote = async (noteData) => {
    try {
      const response = await notesAPI.create(noteData, token);
      dispatch({ type: 'ADD_NOTE', payload: response.note });
      return response.note;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  };

  // Update an existing note
  const updateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.update(id, noteData, token);
      dispatch({ type: 'UPDATE_NOTE', payload: response.note });
      return response.note;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await notesAPI.delete(id, token);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  };

  // Set active note for editing
  const setActiveNote = (id) => {
    dispatch({ type: 'SET_ACTIVE_NOTE', payload: id });
  };

  const value = {
    ...state,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

// Custom hook for using notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
