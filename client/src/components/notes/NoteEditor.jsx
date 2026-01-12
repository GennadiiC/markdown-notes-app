import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNotes } from '../../contexts/NotesContext';
import { Button } from '../shared/Button';

export const NoteEditor = () => {
  const { notes, activeNoteId, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'split', 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const activeNote = notes.find((note) => note.id === activeNoteId);

  // Load active note into editor
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setHasChanges(false);
    }
  }, [activeNote]);

  // Auto-save logic with debounce
  useEffect(() => {
    if (!hasChanges || !activeNoteId) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateNote(activeNoteId, { title, content });
        setLastSaved(new Date());
        setHasChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [title, content, hasChanges, activeNoteId, updateNote]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleDelete = async () => {
    if (!activeNoteId) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(activeNoteId);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const insertMarkdown = useCallback((syntax) => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText;
    let cursorPos;

    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        cursorPos = start + 2;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        cursorPos = start + 1;
        break;
      case 'heading':
        newText = `# ${selectedText || 'Heading'}`;
        cursorPos = start + 2;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        cursorPos = start + 1;
        break;
      case 'code':
        newText = `\`${selectedText || 'code'}\``;
        cursorPos = start + 1;
        break;
      case 'list':
        newText = `- ${selectedText || 'list item'}`;
        cursorPos = start + 2;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    setHasChanges(true);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [content]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-xl mb-2">📝</p>
          <p>Select a note or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="flex items-center gap-2">
          <button
            onClick={() => insertMarkdown('bold')}
            className="toolbar-btn"
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertMarkdown('italic')}
            className="toolbar-btn"
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => insertMarkdown('heading')}
            className="toolbar-btn"
            title="Heading"
          >
            H1
          </button>
          <button
            onClick={() => insertMarkdown('link')}
            className="toolbar-btn"
            title="Link"
          >
            🔗
          </button>
          <button
            onClick={() => insertMarkdown('code')}
            className="toolbar-btn"
            title="Code"
          >
            {'</>'}
          </button>
          <button
            onClick={() => insertMarkdown('list')}
            className="toolbar-btn"
            title="List"
          >
            •
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-800 shadow'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Preview
            </button>
          </div>

          <Button variant="ghost" onClick={handleDelete} className="text-red-600">
            🗑️
          </Button>
        </div>
      </div>

      {/* Title Input */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200 dark:border-gray-700`}>
            <textarea
              id="markdown-editor"
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing in markdown..."
              className="w-full h-full p-6 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-none outline-none font-mono text-sm custom-scrollbar"
              spellCheck="true"
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-y-auto custom-scrollbar`}>
            <div className="p-6 prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>
            {isSaving ? (
              'Saving...'
            ) : lastSaved ? (
              `Last saved: ${lastSaved.toLocaleTimeString()}`
            ) : (
              'All changes saved'
            )}
          </span>
          <span>{content.length} characters</span>
        </div>
      </div>
    </div>
  );
};
