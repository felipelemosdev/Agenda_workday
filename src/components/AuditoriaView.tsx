import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
  Layers,
  FileText,
  AlertOctagon,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Info,
  ExternalLink,
  ArrowRight,
  Clock,
  Trash2,
  Database,
} from 'lucide-react';
import { AuditLog, AuditAction, AuditEntity } from '../types';
import { exportAuditLogsCSV, exportAuditLogsJSON } from '../services/auditService';

interface AuditoriaViewProps {
  logs: AuditLog[];
  onRefresh?: () => void;
  onClearLogs?: () => void;
  onClearAllSystemData?: () => void;
  onNavigateBack?: () => void;
}

export const AuditoriaView: React.FC<AuditoriaViewProps> = ({
  logs,
  onRefresh,
  onClearLogs,
  onClearAllSystemData,
  onNavigateBack,
}) => {
  // Filters state
  const [selectedUser, setSelectedUser] = useState<string>('todos');
  const [selectedAction, setSelectedAction] = useState<string>('todas');
  const [selectedEntity, setSelectedEntity] = useState<string>('todos');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  // Expandable row state for inspecting oldValue, newValue, metadata
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Extract unique users from logs for the filter dropdown
  const uniqueUsers = useMemo(() => {
    const userMap = new Map<string, string>();
    logs.forEach((log) => {
      if (log.userName) {
        userMap.set(log.userId || log.userName, log.userName);
      }
    });
    return Array.from(userMap.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  // Distinct actions and modules present in types
  const actionOptions: { value: AuditAction | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas as Ações' },
    { value: 'CREATE', label: 'Criação (CREATE)' },
    { value: 'UPDATE', label: 'Edição (UPDATE)' },
    { value: 'STATUS_CHANGE', label: 'Mudança de Status (STATUS_CHANGE)' },
    { value: 'DELETE', label: 'Exclusão (DELETE)' },
    { value: 'LOGIN', label: 'Login no Sistema (LOGIN)' },
    { value: 'LOGOUT', label: 'Logout (LOGOUT)' },
    { value: 'UPLOAD', label: 'Upload de Arquivo (UPLOAD)' },
    { value: 'COMPLETE', label: 'Conclusão (COMPLETE)' },
    { value: 'CANCEL', label: 'Cancelamento (CANCEL)' },
  ];

  const entityOptions: { value: AuditEntity | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos os Módulos' },
    { value: 'CLIENT', label: 'Clientes' },
    { value: 'APPOINTMENT', label: 'Agenda / Atendimentos' },
    { value: 'TASK', label: 'Tarefas' },
    { value: 'CASE', label: 'Processos' },
    { value: 'DOCUMENT', label: 'Documentos' },
    { value: 'PROCEEDING', label: 'Andamentos' },
    { value: 'HISTORY', label: 'Histórico' },
    { value: 'INSS_REQUIREMENT', label: 'Meu INSS' },
    { value: 'USER', label: 'Usuários' },
    { value: 'SYSTEM', label: 'Sistema' },
  ];

  // Helper date formatter: DD/MM/YYYY HH:mm
  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return isoString;
    }
  };

  // Indicators calculation
  const todayStr = '2026-09-14'; // Matching system date context
  const indicators = useMemo(() => {
    let actionsToday = 0;
    const activeUsersToday = new Set<string>();
    let recentUpdates = 0;
    let recentDeletions = 0;

    logs.forEach((log) => {
      const logDate = log.timestamp ? log.timestamp.slice(0, 10) : '';
      if (logDate === todayStr || log.timestamp.includes('2026-09-14')) {
        actionsToday++;
        activeUsersToday.add(log.userName || log.userId);
      }

      if (log.action === 'UPDATE' || log.action === 'STATUS_CHANGE') {
        recentUpdates++;
      }

      if (log.action === 'DELETE') {
        recentDeletions++;
      }
    });

    return {
      actionsToday,
      activeUsers: activeUsersToday.size || (actionsToday > 0 ? 1 : 0),
      recentUpdates,
      recentDeletions,
    };
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // User filter
      if (selectedUser !== 'todos') {
        if (log.userId !== selectedUser && log.userName !== selectedUser) {
          return false;
        }
      }

      // Action filter
      if (selectedAction !== 'todas' && log.action !== selectedAction) {
        return false;
      }

      // Entity / Module filter
      if (selectedEntity !== 'todos' && log.entity !== selectedEntity) {
        return false;
      }

      // Date range filter
      if (startDate) {
        const logDate = log.timestamp.slice(0, 10);
        if (logDate < startDate) return false;
      }
      if (endDate) {
        const logDate = log.timestamp.slice(0, 10);
        if (logDate > endDate) return false;
      }

      // Text search
      if (searchText.trim()) {
        const q = searchText.toLowerCase().trim();
        const matchesDescription = log.description?.toLowerCase().includes(q);
        const matchesUser = log.userName?.toLowerCase().includes(q);
        const matchesEntity = log.entity?.toLowerCase().includes(q);
        const matchesEntityName = log.entityName?.toLowerCase().includes(q);
        const matchesAction = log.action?.toLowerCase().includes(q);

        if (
          !matchesDescription &&
          !matchesUser &&
          !matchesEntity &&
          !matchesEntityName &&
          !matchesAction
        ) {
          return false;
        }
      }

      return true;
    });
  }, [logs, selectedUser, selectedAction, selectedEntity, startDate, endDate, searchText]);

  const handleResetFilters = () => {
    setSelectedUser('todos');
    setSelectedAction('todas');
    setSelectedEntity('todos');
    setStartDate('');
    setEndDate('');
    setSearchText('');
  };

  // Badge styling for Actions
  const getActionBadge = (action: AuditAction) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'STATUS_CHANGE':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
      case 'LOGIN':
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      case 'UPLOAD':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800';
      case 'COMPLETE':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  // Entity label mapping
  const getEntityLabel = (entity: AuditEntity) => {
    const labels: Record<AuditEntity, string> = {
      CLIENT: 'Cliente',
      APPOINTMENT: 'Agenda',
      TASK: 'Tarefa',
      CASE: 'Processo',
      DOCUMENT: 'Documento',
      HISTORY: 'Histórico',
      PROCEEDING: 'Andamento',
      INSS_REQUIREMENT: 'Meu INSS',
      USER: 'Usuário',
      SYSTEM: 'Sistema',
    };
    return labels[entity] || entity;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* 1. Header (Cabeçalho) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#091426] dark:bg-slate-800 text-amber-500 flex items-center justify-center border border-amber-500/30 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Configurações → Auditoria
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Auditoria do Sistema
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Histórico das ações realizadas pelos usuários.
          </p>
        </div>

        {/* Action Buttons: Export & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Atualizar registros"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => exportAuditLogsCSV(filteredLogs)}
            title="Exportar dados para planilha CSV"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportAuditLogsJSON(filteredLogs)}
            title="Exportar dados em JSON (Supabase Ready)"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span>JSON</span>
          </button>

          {onClearLogs && logs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Deseja limpar todos os registros de auditoria?')) {
                  onClearLogs();
                }
              }}
              title="Limpar logs de auditoria"
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Logs</span>
            </button>
          )}

          {onClearAllSystemData && (
            <button
              onClick={() => {
                if (window.confirm('Deseja zerar e limpar todos os dados do sistema (clientes, tarefas, processos, agendamentos) e deixar tudo livre?')) {
                  onClearAllSystemData();
                }
              }}
              title="Limpar todos os dados e deixar tudo livre"
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zerar Dados</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Indicadores (Cards de KPI) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Ações hoje */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-blue-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Ações hoje
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              {indicators.actionsToday}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Eventos registrados hoje
            </p>
          </div>
        </div>

        {/* Card 2: Usuários ativos */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Usuários ativos
            </span>
            <User className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {indicators.activeUsers}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Operadores com atividades
            </p>
          </div>
        </div>

        {/* Card 3: Alterações recentes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-amber-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Alterações recentes
            </span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {indicators.recentUpdates}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Edições & mudanças de status
            </p>
          </div>
        </div>

        {/* Card 4: Exclusões recentes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-rose-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Exclusões recentes
            </span>
            <Trash2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl md:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {indicators.recentDeletions}
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Registros removidos
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filtros Avançados */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-slate-700 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filtros de Auditoria</span>
          </div>

          {(selectedUser !== 'todos' ||
            selectedAction !== 'todas' ||
            selectedEntity !== 'todos' ||
            startDate ||
            endDate ||
            searchText) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>

        {/* Grid of filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Busca textual */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Busca textual (descrição, registro, usuário)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Ex: João da Silva, 0001234, Comprovante, alterou status..."
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Usuário */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Usuário
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white"
            >
              <option value="todos">Todos os usuários</option>
              {uniqueUsers.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Ação */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Tipo de Ação
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white"
            >
              {actionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Módulo / Entidade */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Módulo
            </label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white"
            >
              {entityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Data inicial */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Data inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Data final */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Data final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Totalizador de resultados */}
          <div className="flex items-end pb-1 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Exibindo <strong>{filteredLogs.length}</strong> de <strong>{logs.length}</strong> registros
            </span>
          </div>
        </div>
      </div>

      {/* 4. Lista / Tabela de Auditoria */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-700 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">Ação</th>
                <th className="py-3 px-4">Módulo</th>
                <th className="py-3 px-4">Registro</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4 text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                      Nenhum registro de auditoria encontrado.
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tente ajustar os filtros ou a busca textual para localizar os eventos.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const hasDetails = log.oldValue || log.newValue || log.metadata;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => hasDetails && setExpandedLogId(isExpanded ? null : log.id)}
                        className={`hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors ${
                          hasDetails ? 'cursor-pointer' : ''
                        } ${isExpanded ? 'bg-amber-50/40 dark:bg-slate-700/60' : ''}`}
                      >
                        {/* Data / Hora */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {formatDateTime(log.timestamp)}
                        </td>

                        {/* Usuário */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#091426] text-white text-[10px] font-black flex items-center justify-center border border-amber-500/40">
                              {log.userName ? log.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {log.userName}
                              </p>
                              <p className="text-[10px] text-gray-400 capitalize">
                                {log.userRole || 'Operador'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Ação */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getActionBadge(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>

                        {/* Módulo */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {getEntityLabel(log.entity)}
                          </span>
                        </td>

                        {/* Registro */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {log.entityName || log.entityId || '—'}
                          </span>
                        </td>

                        {/* Descrição */}
                        <td className="py-3.5 px-4 min-w-[280px]">
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {log.description}
                          </p>
                        </td>

                        {/* Detalhes toggle */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {hasDetails ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedLogId(isExpanded ? null : log.id);
                              }}
                              className="p-1 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-amber-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-300 dark:text-slate-600 text-xs">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded row for details (oldValue -> newValue / metadata) */}
                      {isExpanded && hasDetails && (
                        <tr className="bg-amber-50/20 dark:bg-slate-900/60 border-y border-amber-100 dark:border-slate-700">
                          <td colSpan={7} className="py-3 px-6 text-xs space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Alterações oldValue -> newValue */}
                              {(log.oldValue || log.newValue) && (
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                                  <span className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                                    Comparação de Valores
                                  </span>

                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                                      <span className="text-[10px] font-bold block uppercase text-rose-500">
                                        Valor Anterior (oldValue)
                                      </span>
                                      <p className="font-mono text-xs mt-0.5">
                                        {typeof log.oldValue === 'object'
                                          ? JSON.stringify(log.oldValue)
                                          : log.oldValue || '—'}
                                      </p>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />

                                    <div className="flex-1 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
                                      <span className="text-[10px] font-bold block uppercase text-emerald-500">
                                        Novo Valor (newValue)
                                      </span>
                                      <p className="font-mono text-xs mt-0.5">
                                        {typeof log.newValue === 'object'
                                          ? JSON.stringify(log.newValue)
                                          : log.newValue || '—'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Metadados adicionais */}
                              {log.metadata && (
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                                  <span className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Info className="w-3.5 h-3.5 text-blue-500" />
                                    Metadados Técnicos (Supabase Ready)
                                  </span>
                                  <pre className="bg-gray-50 dark:bg-slate-900 p-2 rounded-lg text-[11px] font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
