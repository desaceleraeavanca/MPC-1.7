import React, { useState } from 'react';
import { PluralsLogo, Loader } from './Icons';
import type { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateToSignUp: () => void;
  newSignupsAllowed: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToSignUp, newSignupsAllowed }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simula um banco de dados de usuários
    const usersDb: Record<string, { password; profile: UserProfile }> = {
      'alex.rossi@example.com': {
        password: 'caosprodutivo',
        profile: {
          name: 'Alexandre Rossi',
          email: 'alex.rossi@example.com',
          avatarUrl: 'https://i.pravatar.cc/100?u=alex-rossi',
        },
      },
      'adilsonsilva@outlook.com': {
        password: 'Adilson@1176',
        profile: {
          name: 'Adilson Silva',
          email: 'adilsonsilva@outlook.com',
          avatarUrl: 'https://i.pravatar.cc/100?u=adilson-silva',
        },
      },
      'alice.r@example.com': {
        password: '1234',
        profile: {
          name: 'Alice Rodrigues',
          email: 'alice.r@example.com',
          avatarUrl: 'https://i.pravatar.cc/100?u=alice-r',
        },
      },
      'bruno.c@example.com': {
        password: '1234',
        profile: {
          name: 'Bruno Costa',
          email: 'bruno.c@example.com',
          avatarUrl: 'https://i.pravatar.cc/100?u=marwz',
        },
      },
      'carla.d@example.com': {
        password: '1234',
        profile: {
          name: 'Carla Dias',
          email: 'carla.d@example.com',
          avatarUrl: 'https://i.pravatar.cc/100?u=katy',
        },
      },
      'daniel.a@example.com': {
        password: '1234',
        profile: {
          name: 'Daniel Alves',
          email: 'daniel.a@example.com',
          avatarUrl: 'https://i.pravatar.cc/100?u=daniel-a',
        },
      },
    };

    // Simula uma chamada de API
    setTimeout(() => {
      const userRecord = usersDb[email];
      if (userRecord && userRecord.password === password) {
        onLoginSuccess(userRecord.profile);
      } else {
        setError('E-mail ou senha inválidos. Tente novamente.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased">
      {/* Coluna de Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-800 to-indigo-900 p-12 text-white flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow">
              <PluralsLogo className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Plurals</h1>
              <p className="text-sm text-indigo-200">Método da Produtividade Caótica</p>
            </div>
          </div>
        </div>
        <div>
          <blockquote className="text-2xl font-medium leading-relaxed">
            "O mundo não precisa de mais um livro sobre produtividade perfeita. Precisa de um manual para quem vive no caos."
          </blockquote>
        </div>
        <div className="text-sm text-indigo-300">
          &copy; {new Date().getFullYear()} Plurals. Todos os direitos reservados.
        </div>
      </div>

      {/* Coluna do Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:hidden mb-8">
            <PluralsLogo className="w-10 h-10 text-indigo-700 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-800 mt-2">Plurals</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Acesse sua conta</h2>
          <p className="text-slate-600 mb-8">Bem-vindo(a) de volta! Insira seus dados para continuar.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@example.com"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password"className="block text-sm font-medium text-slate-700 mb-1">
                  Senha
                </label>
                <button type="button" onClick={() => alert('A funcionalidade "Esqueceu a senha?" ainda não foi implementada.')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Esqueceu a senha?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3">
                  <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading && <Loader className="animate-spin w-5 h-5 mr-3" />}
                <span>{isLoading ? 'Entrando...' : 'Entrar'}</span>
              </button>
            </div>
          </form>

          {newSignupsAllowed && (
            <p className="mt-8 text-center text-sm text-slate-600">
              Não tem uma conta?{' '}
              <button type="button" onClick={onNavigateToSignUp} className="font-medium text-indigo-600 hover:text-indigo-500">
                Crie uma agora
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};