import React, { useState } from 'react';
import { X, MessageCircle, Send, Copy, Check, User, Phone } from 'lucide-react';
import { Client } from '../../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  clients,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [message, setMessage] = useState(
    'Olá, aqui é da equipe de Advocacia Previdenciária Workday. Gostaria de alinhar os detalhes da sua próxima atividade agendada.'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const rawPhone = (currentClient?.phone || '').replace(/\D/g, '');

  const templates = [
    {
      title: 'Perícia Médica',
      text: `Olá, ${currentClient?.name || 'cliente'}! Lembramos que sua Perícia Médica Previdenciária está agendada. Por favor, leve seus laudos médicos originais com CID e receitas atualizadas.`,
    },
    {
      title: 'Aviso de Audiência',
      text: `Olá, ${currentClient?.name || 'cliente'}! Confirmamos a data da sua audiência perante a Justiça Federal. Estaremos juntos para o acompanhamento completo.`,
    },
    {
      title: 'Exigência do CadÚnico',
      text: `Olá, ${currentClient?.name || 'cliente'}! Identificamos uma pendência do INSS solicitando a folha resumo atualizada do seu CadÚnico emitida pelo CRAS.`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 dark:border-slate-700 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Comunicação & WhatsApp
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Envio rápido de avisos e lembretes para clientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Selector */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Selecionar Cliente:
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} • {c.phone} ({c.benefitType})
              </option>
            ))}
          </select>
        </div>

        {/* Templates */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-500">
            Modelos rápidos de mensagem:
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.title}
                type="button"
                onClick={() => setMessage(tpl.text)}
                className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-gray-700 dark:text-gray-300 hover:text-amber-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-amber-300"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Mensagem personalizada:
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Texto</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
