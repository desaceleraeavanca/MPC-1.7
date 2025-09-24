import React, { useState } from 'react';
import { PluralsLogo, Loader } from './Icons';
import type { UserProfile } from '../types';

interface SignUpProps {
  onSignUpSuccess: (user: UserProfile) => void;
  onNavigateToLogin: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    // Simula uma chamada de API
    setTimeout(() => {
      // Aqui você normalmente faria uma chamada para criar o usuário.
      // Para esta demonstração, vamos apenas logar o usuário.
      const newUser: UserProfile = {
        name,
        email,
        avatarUrl: `https://i.pravatar.cc/100?u=${email}`, // Generate a consistent avatar
      };
      console.log('User created:', newUser);
      onSignUpSuccess(newUser);
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
            "A ação imperfeita e consistente sempre superará a busca paralisante pela perfeição."
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
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Crie sua conta</h2>
          <p className="text-slate-600 mb-8">Comece sua jornada para uma produtividade mais caótica e eficaz.</p>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
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
              <label htmlFor="password"className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-700 mb-1">
                Confirmar Senha
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>{isLoading ? 'Criando...' : 'Criar Conta'}</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Já tem uma conta?{' '}
            <button type="button" onClick={onNavigateToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
