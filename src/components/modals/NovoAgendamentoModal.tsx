import React, { useState, useEffect } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { Activity, ActivityType, Client } from '../../types';

interface NovoAgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Activity) => void;
  clients: Client[];
  initialClientName?: string;
}

export const NovoAgendamentoModal: React.FC<NovoAgendamentoModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
  clients,
  initialClientName,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('Audiencia');
  const [clientName, setClientName] = useState(
    initialClientName || clients[0]?.name || ''
  );
  const [date, setDate] = useState('2026-09-14');
  const [time, setTime] = useState('11:00');
  const [varaOrChannel, setVaraOrChannel] = useState('3ª Vara Previdenciária');
  const [badge, setBadge] = useState<'Hoje' | 'Urgente' | 'Normal'>('Hoje');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialClientName) {
      setClientName(initialClientName);
    } else if (clients.length > 0 && !clientName) {
      setClientName(clients[0].name);
    }
  }, [initialClientName, clients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedClient = clients.find((c) => c.name === clientName);

    const newAct: Activity = {
      id: 'act_' + Date.now(),
      title: title.trim(),
      type,
      clientName: clientName.trim() || 'Cliente Geral',
      clientId: matchedClient?.id,
      details: `${clientName} • ${varaOrChannel}`,
      varaOrChannel,
      date,
      time,
      completed: false,
      badge,
      notes: notes.trim(),
    };

    onAddActivity(newAct);
    onClose();
    // reset
    setTitle('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 md:p-6 shadow-xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D97706] text-white flex items-center justify-center">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#191c1e]">Novo Agendamento</h2>
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
              Tipo de Compromisso *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            >
              <option value="Audiencia">Audiência (Conciliação / Instrução)</option>
              <option value="Pericia">Perícia Médica Previdenciária</option>
              <option value="Protocolo">Protocolo INSS Digital / Exigência</option>
              <option value="Reuniao">Reunião com Perito / Cliente</option>
              <option value="Prazo">Prazo Fatal / Recurso Administrativo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Título do Agendamento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Perícia Médica Judicial ou Audiência de Instrução"
              className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Vincular a Cliente *
            </label>
            {clients.length > 0 ? (
              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              >
                <option value="">Selecione um cliente cadastrado...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.benefitType})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Nome do cliente ou interessado"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Horário *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Local / Vara / Canal
              </label>
              <input
                type="text"
                value={varaOrChannel}
                onChange={(e) => setVaraOrChannel(e.target.value)}
                placeholder="Ex: Agência INSS Centro ou Fórum Federal"
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                Prioridade
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#D97706] focus:outline-none"
              >
                <option value="Hoje">Hoje</option>
                <option value="Urgente">Urgente</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1e] mb-1">
              Instruções / Notas da Pauta
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Levar cópia do laudo médico com CID e receitas..."
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
              className="px-5 py-2 text-xs font-semibold bg-[#D97706] hover:bg-[#b45309] text-white rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Agendar Compromisso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
