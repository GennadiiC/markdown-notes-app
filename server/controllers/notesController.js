import pool from '../db.js';

// Get all notes for the authenticated user
export const getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.userId]
    );

    res.json({ notes: result.rows });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Server error fetching notes' });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ note: result.rows[0] });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Server error fetching note' });
  }
};

// Create a new note
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, title, content, created_at, updated_at',
      [req.user.userId, title, content]
    );

    res.status(201).json({
      message: 'Note created successfully',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Server error creating note' });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING id, title, content, created_at, updated_at',
      [title, content, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully',
      note: result.rows[0],
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Server error updating note' });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Server error deleting note' });
  }
};
