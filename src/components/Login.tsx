import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { PluralsLogo } from './Icons';
import { supabase } from '../integrations/supabase/client';

export const Login: React.FC = () => {
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
          <p className="text-slate-600 mb-8">Bem-vindo(a)! Insira seus dados para continuar ou crie uma nova conta.</p>

          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Endereço de e-mail',
                  password_label: 'Sua senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Entrar',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Endereço de e-mail',
                  password_label: 'Crie uma senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Criar conta',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Não tem uma conta? Crie uma',
                  user_details_label: 'Por favor, insira seus dados abaixo',
                  confirmation_text: 'Verifique seu e-mail para o link de confirmação',
                },
                forgotten_password: {
                  email_label: 'Endereço de e-mail',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções de recuperação',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu e-mail para o link de recuperação',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};