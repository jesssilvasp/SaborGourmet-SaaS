import React, { useState } from 'react';
import { Lock, Mail, Store, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginViewProps {
  onGoToDigitalMenu?: () => void;
  onGoToLanding?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onGoToDigitalMenu, onGoToLanding }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@restaurante.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique e-mail e senha.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-3xl shadow-lg shadow-rose-950/50">
            🍔
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Sabor Gourmet</h1>
          <p className="text-xs text-slate-400">Sistema Completo de Vendas e Gestão Gastronômica</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">E-mail do Funcionário</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@restaurante.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Senha de Acesso</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Acessando...' : 'Entrar no Sistema'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="pt-4 border-t border-slate-700/60 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
            Acesso Rápido de Demonstração:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickDemoUser('admin@restaurante.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-rose-300 font-semibold border border-slate-700 text-left transition-colors truncate"
            >
              👑 Admin (admin123)
            </button>
            <button
              onClick={() => handleQuickDemoUser('caixa@restaurante.com', 'caixa123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-amber-300 font-semibold border border-slate-700 text-left transition-colors truncate"
            >
              💰 Caixa (caixa123)
            </button>
            <button
              onClick={() => handleQuickDemoUser('cozinha@restaurante.com', 'cozinha123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 text-left transition-colors truncate"
            >
              👨‍🍳 Cozinha (cozinha123)
            </button>
            <button
              onClick={() => handleQuickDemoUser('garcom@restaurante.com', 'garcom123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-emerald-300 font-semibold border border-slate-700 text-left transition-colors truncate"
            >
              🍽️ Garçom (garcom123)
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-col items-center gap-2 text-center">
          {onGoToDigitalMenu && (
            <button
              onClick={onGoToDigitalMenu}
              className="text-xs font-semibold text-rose-400 hover:underline inline-flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              Acessar Cardápio Digital Público
            </button>
          )}

          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              &larr; Voltar para a Página Inicial (Landing Page)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
