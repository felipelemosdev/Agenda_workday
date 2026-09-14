import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CalendarCheck,
  AlertTriangle,
  Scale,
  Bell,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Trash2,
  X,
  FileText,
} from 'lucide-react';
import { Activity, TabType, LawCase, ReminderItem } from '../types';

interface DashboardViewProps {
  lawyerName?: string;
  activities: Activity[];
  onNavigateTab: (tab: TabType) => void;
  onOpenNewClient: () => void;
  onOpenNewActivity: () => void;
  onSelectActivity: (act: Activity) => void;
  onSelectCase?: (lawCase: LawCase) => void;
  totalClients: number;
  totalCases: number;
  urgentInssCount: number;
  cases?: LawCase[];
  reminders?: ReminderItem[];
  onAddReminder?: (title: string) => void;
  onToggleReminder?: (id: string) => void;
  onDeleteReminder?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lawyerName = 'Felipe',
  activities,
  onNavigateTab,
  onOpenNewClient,
  onOpenNewActivity,
  onSelectActivity,
  onSelectCase,
  totalClients,
  totalCases,
  urgentInssCount,
  cases = [],
  reminders = [],
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
}) => {
  const [isNewReminderOpen, setIsNewReminderOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');

  // Activities for today (2026-09-14)
  const todayActivities = activities.filter((a) => a.date === '2026-09-14' || a.badge === 'Hoje');
  // Upcoming activities (after today)
  const upcomingActivities = activities.filter((a) => a.date > '2026-09-14' || a.badge !== 'Hoje').slice(0, 3);
  // Urgent cases
  const urgentCases = cases.filter((c) => c.urgency === 'Urgente' || c.status === 'Em Exigência').slice(0, 3);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText.trim() || !onAddReminder) return;
    onAddReminder(newReminderText.trim());
    setNewReminderText('');
    setIsNewReminderOpen(false);
  };

  // Extract first name (e.g. Felipe)
  const displayName = lawyerName ? lawyerName.split(' ')[0] : 'Felipe';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* 1. Header Greeting matching screenshot */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          Bom dia, {displayName} <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Aqui está o resumo das atividades do escritório.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium capitalize pt-0.5">
          Segunda-Feira, 14 De Setembro De 2026
        </p>
      </div>

      {/* 2. Top 4 Metric / KPI Cards with distinct colored accent borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Blue accent - Atendimentos este mês */}
        <div
          id="card-kpi-atendimentos"
          onClick={() => onNavigateTab('clientes')}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              Setembro
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {totalClients}
            </span>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              Atendimentos este mês
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Mês corrente
            </p>
          </div>
        </div>

        {/* Card 2: Emerald accent - Agendados para hoje */}
        <div
          id="card-kpi-hoje"
          onClick={() => onNavigateTab('agenda')}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-emerald-500 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
              Hoje
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {todayActivities.length}
            </span>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              Agendados para hoje
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Hoje
            </p>
          </div>
        </div>

        {/* Card 3: Amber/Orange accent - Pendências */}
        <div
          id="card-kpi-pendencias"
          onClick={() => onNavigateTab('meu_inss')}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-amber-500 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
              Atenção
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {urgentInssCount}
            </span>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              Pendências
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Requerem atenção
            </p>
          </div>
        </div>

        {/* Card 4: Purple accent - Processos ativos */}
        <div
          id="card-kpi-processos"
          onClick={() => onNavigateTab('processos')}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-purple-500 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
              Judiciais
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {totalCases}
            </span>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              Processos ativos
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Em andamento
            </p>
          </div>
        </div>
      </div>

      {/* 3. Lower Section: 2 Columns Layout exactly like screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* Card: Lembretes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Lembretes
                </h2>
              </div>

              <button
                onClick={() => setIsNewReminderOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo</span>
              </button>
            </div>

            {/* If no reminders, display dashed box just like in image.png */}
            {reminders.length === 0 ? (
              <div className="border border-dashed border-gray-200 dark:border-slate-700 rounded-xl py-6 px-4 text-center text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                <span>Sem lembretes pendentes.</span>
                <span>🎉</span>
              </div>
            ) : (
              <div className="space-y-2">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                      rem.done
                        ? 'bg-gray-50 dark:bg-slate-900/40 border-gray-200 text-gray-400 line-through'
                        : 'bg-[#f8fafc] dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={rem.done}
                        onChange={() => onToggleReminder && onToggleReminder(rem.id)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="truncate">{rem.title}</span>
                    </div>
                    {onDeleteReminder && (
                      <button
                        onClick={() => onDeleteReminder(rem.id)}
                        className="text-gray-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Atendimentos do dia */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Atendimentos do dia
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                14 De Setembro
              </span>
            </div>

            <div className="space-y-2.5">
              {todayActivities.length === 0 ? (
                <div className="border border-dashed border-gray-200 dark:border-slate-700 rounded-xl py-6 text-center text-gray-500 text-sm">
                  Nenhum atendimento agendado para hoje.
                </div>
              ) : (
                todayActivities.map((act) => {
                  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  if (act.type === 'Audiencia') badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
                  if (act.type === 'Pericia') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  if (act.type === 'Reuniao') badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

                  return (
                    <div
                      key={act.id}
                      onClick={() => onSelectActivity(act)}
                      className="p-3 bg-[#f8fafc] dark:bg-slate-900/60 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-10 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200 shrink-0">
                          {act.time}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-600 transition-colors">
                            {act.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {act.clientName} • {act.varaOrChannel || act.details}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                          {act.type}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Card: Próximas atividades */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Próximas atividades
                </h2>
              </div>
            </div>

            {/* Upcoming activities list */}
            <div className="space-y-2.5">
              {upcomingActivities.length === 0 ? (
                <div className="border border-dashed border-gray-200 dark:border-slate-700 rounded-xl py-6 px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  Sem compromissos próximos.
                </div>
              ) : (
                upcomingActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => onSelectActivity(act)}
                    className="p-3 bg-[#f8fafc] dark:bg-slate-900/60 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          {act.date} às {act.time}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                          {act.type}
                        </span>
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-600 transition-colors mt-0.5">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        {act.clientName} • {act.varaOrChannel}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </div>
                ))
              )}
            </div>

            {/* Link to view full agenda */}
            <button
              onClick={() => onNavigateTab('agenda')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors cursor-pointer pt-1"
            >
              <span>Ver agenda completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card: Processos que exigem atenção */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Processos que exigem atenção
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('processos')}
                className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-2.5">
              {urgentCases.length === 0 ? (
                <div className="border border-dashed border-gray-200 dark:border-slate-700 rounded-xl py-6 text-center text-gray-500 text-sm">
                  Nenhum processo com prazo urgente hoje.
                </div>
              ) : (
                urgentCases.map((cas) => (
                  <div
                    key={cas.id}
                    onClick={() => {
                      if (onSelectCase) onSelectCase(cas);
                      else onNavigateTab('processos');
                    }}
                    className="p-3 bg-[#f8fafc] dark:bg-slate-900/60 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {cas.clientName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          {cas.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate mt-0.5">
                        {cas.court} • {cas.benefitType}
                      </p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 truncate font-medium">
                        Prazo: {cas.deadlineDate} • {cas.lastUpdate}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Reminder Modal */}
      {isNewReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Novo Lembrete Rápido
              </h3>
              <button
                onClick={() => setIsNewReminderOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <input
                type="text"
                required
                autoFocus
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                placeholder="Ex: Ligar para o perito do caso Maria às 15h"
                className="w-full px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewReminderOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#D97706] hover:bg-[#b45309] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
