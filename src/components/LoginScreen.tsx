import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Scale,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { AppUser, UserRole } from '../types';
import { APP_USERS, DEFAULT_PASSWORD } from '../data/users';
import workdayLogo from '../assets/images/workday_logo_1789394938409.jpg';

interface LoginScreenProps {
  onLoginSuccess: (user: AppUser) => void;
  currentPasswordMap: Record<string, string>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  currentPasswordMap,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = usernameInput.trim().toLowerCase();

    if (!cleanUsername) {
      setErrorMsg('Por favor, informe seu usuário.');
      return;
    }

    const user = APP_USERS[cleanUsername as UserRole] || APP_USERS[cleanUsername] || (cleanUsername === 'felipe' ? APP_USERS.felipe : null);

    if (!user) {
      setErrorMsg(
        'Usuário não encontrado. Usuários disponíveis: felipe, advogada, secretaria, estagiario.'
      );
      return;
    }

    const expectedPassword =
      currentPasswordMap[cleanUsername] || DEFAULT_PASSWORD;

    if (!password) {
      setErrorMsg('Por favor, informe a senha.');
      return;
    }

    if (password !== expectedPassword) {
      setErrorMsg('Senha incorreta para este usuário.');
      return;
    }

    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-[#091426] border-2 border-[#D97706]/50 shadow-lg overflow-hidden mb-1 ring-4 ring-[#D97706]/15">
            {!logoError ? (
              <img
                src={workdayLogo}
                alt="Logo Workday"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Scale className="w-12 h-12 text-[#D97706]" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#091426]">
              Workday
            </h1>
            <p className="text-xs text-[#45474c] mt-1">
              Agenda Eletrônica & Gestão de Clientes
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="input-username"
                className="block text-xs font-semibold text-[#191c1e] mb-1.5"
              >
                Usuário
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-username"
                  type="text"
                  required
                  autoFocus
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Informe seu usuário"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="input-password"
                className="block text-xs font-semibold text-[#191c1e] mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar ou ocultar senha"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#191c1e] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3 bg-[#091426] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Acessar Workday</span>
              <ArrowRight className="w-4 h-4 text-[#D97706]" />
            </button>
          </form>
        </div>

        {/* Security Info */}
        <div className="p-3 bg-white/70 border border-[#E2E8F0] rounded-2xl text-xs text-[#45474c] text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Acesso seguro ao painel Workday</span>
        </div>
      </div>
    </div>
  );
};
