import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/notes - Get all notes for the user
router.get('/', getNotes);

// GET /api/notes/:id - Get a specific note
router.get('/:id', getNoteById);

// POST /api/notes - Create a new note
router.post('/', createNote);

// PUT /api/notes/:id - Update a note
router.put('/:id', updateNote);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', deleteNote);

export default router;
