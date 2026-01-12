import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import pool from '../db.js';

describe('Notes API', () => {
  let authToken;
  let userId;
  let noteId;

  // Set up test user and get auth token
  beforeAll(async () => {
    // Clean up any existing test data
    await pool.query("DELETE FROM users WHERE username = 'notestestuser'");

    // Register a test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'notestestuser',
        email: 'notestest@example.com',
        password: 'password123',
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE username = 'notestestuser'");
    await pool.end();
  });

  describe('POST /api/notes', () => {
    it('should create a new note with valid token', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: '# My Test Note\n\nThis is a **markdown** note.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('note');
      expect(response.body.note.title).toBe('Test Note');
      expect(response.body.note.content).toContain('markdown');
      expect(response.body.note).toHaveProperty('id');

      noteId = response.body.note.id;
    });

    it('should reject note creation without auth token', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          content: 'Content',
        });

      expect(response.status).toBe(401);
    });

    it('should reject note creation with invalid token', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer invalidtoken')
        .send({
          title: 'Test Note',
          content: 'Content',
        });

      expect(response.status).toBe(403);
    });

    it('should reject note creation with missing fields', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /api/notes', () => {
    it('should get all notes for authenticated user', async () => {
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('notes');
      expect(Array.isArray(response.body.notes)).toBe(true);
      expect(response.body.notes.length).toBeGreaterThan(0);
    });

    it('should reject request without auth token', async () => {
      const response = await request(app).get('/api/notes');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a specific note by ID', async () => {
      const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('note');
      expect(response.body.note.id).toBe(noteId);
      expect(response.body.note.title).toBe('Test Note');
    });

    it('should return 404 for non-existent note', async () => {
      const response = await request(app)
        .get('/api/notes/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update an existing note', async () => {
      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Note',
          content: '# Updated Content\n\nThis note has been updated.',
        });

      expect(response.status).toBe(200);
      expect(response.body.note.title).toBe('Updated Test Note');
      expect(response.body.note.content).toContain('updated');
    });

    it('should reject update with missing fields', async () => {
      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Only Title',
        });

      expect(response.status).toBe(400);
    });

    it('should return 404 when updating non-existent note', async () => {
      const response = await request(app)
        .put('/api/notes/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test',
          content: 'Test',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete an existing note', async () => {
      const response = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
    });

    it('should return 404 when deleting non-existent note', async () => {
      const response = await request(app)
        .delete('/api/notes/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should reject delete without auth token', async () => {
      const response = await request(app).delete(`/api/notes/${noteId}`);

      expect(response.status).toBe(401);
    });
  });
});
