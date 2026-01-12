import { useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const NotesList = () => {
  const { notes, activeNoteId, setActiveNote, createNote, loading } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Untitled Note',
        content: '# New Note\n\nStart writing...',
      });
      setActiveNote(newNote.id);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="sidebar h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button variant="primary" onClick={handleCreateNote} className="w-full mb-3">
          ➕ New Note
        </Button>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading && notes.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No notes found' : 'No notes yet. Create one!'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`note-list-item ${
                activeNoteId === note.id ? 'active' : ''
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {note.content.substring(0, 100)}...
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {formatDate(note.updated_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
