import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Client } from '../../types';

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

export const NovoClienteModal: React.FC<NovoClienteModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [govPassword, setGovPassword] = useState('');
  const [benefitType, setBenefitType] = useState('BPC DEFICIENTE');
  const [originIndication, setOriginIndication] = useState('');
  const [nitPis, setNitPis] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cpf.trim()) return;

    const newClient: Client = {
      id: 'c_' + Date.now(),
      name: name.trim(),
      cpf: cpf.trim(),
      phone: phone.trim() || '(11) 99999-9999',
      email: email.trim(),
      govPassword: govPassword.trim() || 'Inss.2026',
      benefitType,
      originIndication: originIndication.trim(),
      nitPis: nitPis.trim() || '123.45678.90-1',
      status: 'Ativo',
      createdAt: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
      documents: [],
      tasks: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          date: new Date().toLocaleDateString('pt-BR'),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          author: 'Equipe Workday',
          category: 'Atendimento',
          description: 'Cadastro inicial do segurado realizado na plataforma.',
        },
      ],
      proceedings: [],
    };

    onAddClient(newClient);
    onClose();
    // reset
    setName('');
    setCpf('');
    setPhone('');
    setEmail('');
    setGovPassword('');
    setOriginIndication('');
    setNitPis('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 md:p-6 shadow-xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#D97706]" />
            </div>
            <h2 className="text-lg font-bold text-[#191c1e]">Novo Cliente</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Nome Completo do Segurado *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Adriana da Silva Oliveira"
              className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                CPF *
              </label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
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
                placeholder="(21) 98708-6788"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Acesso Gov. INSS (Senha)
              </label>
              <input
                type="text"
                value={govPassword}
                onChange={(e) => setGovPassword(e.target.value)}
                placeholder="Ex: Inss.2026"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Origem da Indicação
              </label>
              <input
                type="text"
                value={originIndication}
                onChange={(e) => setOriginIndication(e.target.value)}
                placeholder="Ex: Indicação, Instagram, Google"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Benefício Pretendido *
              </label>
              <input
                type="text"
                required
                value={benefitType}
                onChange={(e) => setBenefitType(e.target.value)}
                placeholder="Ex: BPC DEFICIENTE"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Observações Iniciais
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Laudos médicos, histórico de contribuições, perícia prévia..."
              className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />
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
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
