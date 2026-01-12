import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">
              📝 Markdown Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your personal note-taking companion
            </p>
          </div>

          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};
