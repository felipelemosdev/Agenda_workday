import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  FileText,
  Filter,
} from 'lucide-react';
import { Activity, ActivityType } from '../types';

interface AgendaViewProps {
  activities: Activity[];
  onOpenNewActivity: () => void;
  onSelectActivity: (activity: Activity) => void;
  onToggleComplete: (id: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  activities,
  onOpenNewActivity,
  onSelectActivity,
  onToggleComplete,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'hoje' | 'semana' | 'todos'>('todos');

  const filteredActivities = activities.filter((act) => {
    // Type filter
    if (filterType !== 'all' && act.type !== filterType) return false;

    // Search filter
    if (
      searchQuery &&
      !act.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !act.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !act.details.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Date filter
    if (dateFilter === 'hoje' && act.date !== '2026-09-14') return false;

    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
            Agenda Jurídica
          </h1>
          <p className="text-sm text-[#45474c]">
            Acompanhe audiências, perícias médicas judiciais e prazos de protocolo.
          </p>
        </div>

        <button
          id="btn-agenda-new-activity"
          onClick={onOpenNewActivity}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D97706] hover:bg-[#b45309] text-white font-medium text-sm rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Date & Type Filters */}
      <div className="bg-[#f2f4f6] rounded-2xl p-3.5 border border-[#E2E8F0] space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-agenda-search"
            type="text"
            placeholder="Buscar por cliente, tipo de audiência ou vara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-sm text-[#191c1e] pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#75777d] font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>

          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#091426] text-white'
                : 'bg-white text-[#45474c] hover:bg-gray-100 border border-[#E2E8F0]'
            }`}
          >
            Todos ({activities.length})
          </button>

          <button
            onClick={() => setFilterType('Audiencia')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'Audiencia'
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-white text-[#ba1a1a] hover:bg-red-50 border border-[#E2E8F0]'
            }`}
          >
            Audiências
          </button>

          <button
            onClick={() => setFilterType('Pericia')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'Pericia'
                ? 'bg-[#091426] text-white'
                : 'bg-white text-[#091426] hover:bg-slate-100 border border-[#E2E8F0]'
            }`}
          >
            Perícias
          </button>

          <button
            onClick={() => setFilterType('Protocolo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'Protocolo'
                ? 'bg-[#D97706] text-white'
                : 'bg-white text-[#D97706] hover:bg-amber-50 border border-[#E2E8F0]'
            }`}
          >
            Protocolos INSS
          </button>

          <button
            onClick={() => setFilterType('Reuniao')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === 'Reuniao'
                ? 'bg-[#1e293b] text-white'
                : 'bg-white text-[#1e293b] hover:bg-slate-100 border border-[#E2E8F0]'
            }`}
          >
            Reuniões
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 pb-8">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] space-y-2">
            <Clock className="w-10 h-10 text-[#75777d] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#191c1e]">
              Nenhum agendamento encontrado
            </p>
            <p className="text-xs text-[#45474c]">
              Tente ajustar os filtros ou clique em "Novo Agendamento" para adicionar.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isAudiencia = act.type === 'Audiencia';
            const isPericia = act.type === 'Pericia';
            const isProtocolo = act.type === 'Protocolo';

            let typeBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
            if (isAudiencia) typeBadgeColor = 'bg-red-50 text-red-700 border-red-200';
            if (isPericia) typeBadgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
            if (isProtocolo) typeBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={act.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  act.completed
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-75'
                    : 'border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => onToggleComplete(act.id)}
                    aria-label={act.completed ? 'Marcar pendente' : 'Marcar concluído'}
                    className="mt-1 text-[#75777d] hover:text-[#091426] cursor-pointer transition-colors"
                  >
                    {act.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border ${typeBadgeColor}`}
                      >
                        {act.type}
                      </span>

                      {act.badge && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            act.badge === 'Urgente'
                              ? 'bg-amber-100 text-amber-900'
                              : act.badge === 'Hoje'
                              ? 'bg-red-100 text-red-900'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {act.badge}
                        </span>
                      )}

                      <span className="text-xs text-[#75777d] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.time}h • {act.date}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectActivity(act)}
                      className={`text-base font-semibold cursor-pointer hover:text-[#D97706] transition-colors ${
                        act.completed ? 'line-through text-[#75777d]' : 'text-[#191c1e]'
                      }`}
                    >
                      {act.title}
                    </h3>

                    <p className="text-xs text-[#45474c] flex items-center gap-1">
                      <span className="font-medium text-[#191c1e]">
                        {act.clientName}
                      </span>
                      {act.varaOrChannel && ` • ${act.varaOrChannel}`}
                    </p>

                    {act.notes && (
                      <p className="text-xs text-[#75777d] bg-[#f7f9fb] p-2 rounded-lg mt-1 border border-[#E2E8F0]">
                        {act.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center pl-8 sm:pl-0">
                  <button
                    onClick={() => onSelectActivity(act)}
                    className="px-3 py-1.5 text-xs font-medium text-[#191c1e] bg-[#f2f4f6] hover:bg-[#eceef0] rounded-lg transition-colors cursor-pointer border border-[#E2E8F0]"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
