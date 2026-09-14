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
} from 'lucide-react';
import { AppUser } from '../../types';

interface PerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onSaveName: (name: string) => void;
  onChangePassword: (username: string, newPass: string) => void;
}

export const PerfilModal: React.FC<PerfilModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveName,
  onChangePassword,
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
      <div className="bg-white rounded-2xl max-w-md w-full p-5 md:p-6 shadow-xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center">
              <User className="w-4 h-4 text-[#D97706]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#191c1e]">Perfil e Segurança</h2>
              <span className="text-xs text-[#75777d]">
                Usuário: <strong>{currentUser.username}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3 bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#75777d]">Nível de Acesso:</span>
            <span className="font-bold px-2 py-0.5 rounded-md bg-[#091426] text-white uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#75777d]">Função:</span>
            <span className="font-semibold text-[#191c1e]">{currentUser.roleLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#75777d]">E-mail:</span>
            <span className="font-medium text-[#45474c]">{currentUser.email}</span>
          </div>
        </div>

        {passwordFeedback && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedbackType === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
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
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />
          </div>

          {/* Change Password Section */}
          <div className="pt-2 border-t border-[#E2E8F0] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
                Trocar Senha de Acesso
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#75777d] hover:text-[#191c1e] flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPassword ? 'Ocultar' : 'Exibir'}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#75777d] mb-1">
                Nova Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha para este usuário"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none font-mono"
              />
            </div>

            {newPassword && (
              <div>
                <label className="block text-[11px] font-medium text-[#75777d] mb-1">
                  Confirme a Nova Senha
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
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
