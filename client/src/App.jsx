import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { NotesList } from './components/notes/NotesList';
import { NoteEditor } from './components/notes/NoteEditor';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Main app content (requires auth)
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <NotesList />
        <NoteEditor />
      </div>
    </div>
  );
};

// App with all providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <AppContent />
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
