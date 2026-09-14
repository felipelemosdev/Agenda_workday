import React, { useState } from 'react';
import { X, User, Phone, Mail, Shield, Award, MapPin, Tag } from 'lucide-react';
import { Client } from '../../types';

interface EditarClienteModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedClient: Client) => void;
}

export const EditarClienteModal: React.FC<EditarClienteModalProps> = ({
  client,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(client.name);
  const [cpf, setCpf] = useState(client.cpf);
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email || '');
  const [govPassword, setGovPassword] = useState(client.govPassword || '');
  const [benefitType, setBenefitType] = useState(client.benefitType || 'BPC DEFICIENTE');
  const [originIndication, setOriginIndication] = useState(client.originIndication || '');
  const [status, setStatus] = useState(client.status || 'Ativo');
  const [notes, setNotes] = useState(client.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...client,
      name: name.trim(),
      cpf: cpf.trim(),
      phone: phone.trim(),
      email: email.trim(),
      govPassword: govPassword.trim(),
      benefitType: benefitType.trim(),
      originIndication: originIndication.trim(),
      status: status as any,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E8F0] shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-[#191c1e]">
              Editar Informações do Cliente
            </h2>
            <p className="text-xs text-[#45474c]">
              Atualize dados cadastrais, acesso ao Meu INSS e tipo de benefício.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#75777d] hover:text-[#191c1e] hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                CPF *
              </label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Telefone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Senha / Acesso Gov. INSS
              </label>
              <input
                type="text"
                placeholder="Ex: Inss.2026"
                value={govPassword}
                onChange={(e) => setGovPassword(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Benefício / Atendimento
              </label>
              <input
                type="text"
                required
                placeholder="Ex: BPC DEFICIENTE"
                value={benefitType}
                onChange={(e) => setBenefitType(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Origem da Indicação
              </label>
              <input
                type="text"
                placeholder="Ex: Indicação, Instagram, Parceiro"
                value={originIndication}
                onChange={(e) => setOriginIndication(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Situação do Cliente
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none bg-white"
            >
              <option value="Ativo">Ativo</option>
              <option value="Em Atendimento">Em Atendimento</option>
              <option value="Processo Ativo">Processo Ativo</option>
              <option value="Aguardando Documentos">Aguardando Documentos</option>
              <option value="Benefício Concedido">Benefício Concedido</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Observações Estratégicas
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações médicas, perícia, vínculos no CNIS ou detalhes relevantes..."
              className="w-full text-sm p-2.5 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#45474c] hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm bg-[#D97706] hover:bg-[#b45309] text-white font-semibold rounded-xl transition-colors shadow-xs"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
