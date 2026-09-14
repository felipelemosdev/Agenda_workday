import React, { useState } from 'react';
import {
  X,
  User,
  Scale,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { AppUser } from '../../types';

interface PerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onSaveName: (name: string) => void;
  onChangePassword: (username: string, newPass: string) => void;
  isDarkMode?: boolean;
  onSetTheme?: (dark: boolean) => void;
  onOpenAuditoria?: () => void;
}

export const PerfilModal: React.FC<PerfilModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveName,
  onChangePassword,
  isDarkMode = false,
  onSetTheme,
  onOpenAuditoria,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSaveName(name.trim());
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setPasswordFeedback('A nova senha deve ter no mínimo 6 caracteres.');
        setFeedbackType('error');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordFeedback('A confirmação de senha não confere.');
        setFeedbackType('error');
        return;
      }

      onChangePassword(currentUser.username, newPassword);
      setPasswordFeedback('Senha atualizada com sucesso!');
      setFeedbackType('success');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1500);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 md:p-6 shadow-xl border border-gray-200 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center">
              <User className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Perfil e Configurações</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Usuário: <strong>{currentUser.username}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Nível de Acesso:</span>
            <span className="font-bold px-2 py-0.5 rounded-md bg-[#091426] text-white uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Função:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{currentUser.roleLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">E-mail:</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{currentUser.email}</span>
          </div>
        </div>

        {/* Configurações de Tema */}
        {onSetTheme && (
          <div className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-gray-900 dark:text-white">
              Tema da Interface
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSetTheme(false)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                  !isDarkMode
                    ? 'bg-white dark:bg-slate-800 text-amber-900 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Tema Claro</span>
                </div>
                {!isDarkMode && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>

              <button
                type="button"
                onClick={() => onSetTheme(true)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                  isDarkMode
                    ? 'bg-[#091426] text-white border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Tema Escuro</span>
                </div>
                {isDarkMode && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          </div>
        )}

        {/* Atalho Configurações → Auditoria */}
        {onOpenAuditoria && (
          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Auditoria do Sistema</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Consultar histórico de operações</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuditoria();
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Acessar
            </button>
          </div>
        )}

        {passwordFeedback && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedbackType === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800'
            }`}
          >
            {feedbackType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{passwordFeedback}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Change Password Section */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                Trocar Senha de Acesso
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPassword ? 'Ocultar' : 'Exibir'}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                Nova Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha para este usuário"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-gray-900 dark:text-white"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Confirme a Nova Senha
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#091426] hover:bg-[#1e293b] text-white rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Salvar Dados
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
