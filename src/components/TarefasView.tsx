import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Clock,
  User,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Client, ClientTask } from '../types';

interface GlobalTask extends ClientTask {
  clientName: string;
  clientId: string;
}

interface TarefasViewProps {
  clients: Client[];
  onUpdateClient: (updated: Client) => void;
  onNavigateToClient?: (clientId: string) => void;
}

export const TarefasView: React.FC<TarefasViewProps> = ({
  clients,
  onUpdateClient,
  onNavigateToClient,
}) => {
  const [filterStatus, setFilterStatus] = useState<'todas' | 'pendentes' | 'urgentes' | 'concluidas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('18/09/2026');
  const [newPriority, setNewPriority] = useState<'Urgente' | 'Média' | 'Normal'>('Urgente');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');

  // Aggregate all tasks across clients
  const allTasks: GlobalTask[] = [];
  clients.forEach((c) => {
    (c.tasks || []).forEach((t) => {
      allTasks.push({
        ...t,
        clientName: c.name,
        clientId: c.id,
      });
    });
  });

  const handleToggleTask = (taskId: string, clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const updatedTasks = (client.tasks || []).map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );

    onUpdateClient({
      ...client,
      tasks: updatedTasks,
    });
  };

  const handleDeleteTask = (taskId: string, clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const updatedTasks = (client.tasks || []).filter((t) => t.id !== taskId);
    onUpdateClient({
      ...client,
      tasks: updatedTasks,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedClientId) return;

    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) return;

    const newTask: ClientTask = {
      id: 'task_' + Date.now(),
      title: newTitle.trim(),
      dueDate: newDueDate,
      priority: newPriority,
      done: false,
    };

    onUpdateClient({
      ...client,
      tasks: [newTask, ...(client.tasks || [])],
    });

    setNewTitle('');
    setIsNewTaskModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = allTasks.filter((task) => {
    if (filterStatus === 'pendentes' && task.done) return false;
    if (filterStatus === 'concluidas' && !task.done) return false;
    if (filterStatus === 'urgentes' && (task.priority !== 'Urgente' || task.done)) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      task.title.toLowerCase().includes(q) ||
      task.clientName.toLowerCase().includes(q)
    );
  });

  const pendingCount = allTasks.filter((t) => !t.done).length;
  const urgentCount = allTasks.filter((t) => !t.done && t.priority === 'Urgente').length;
  const completedCount = allTasks.filter((t) => t.done).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header and Add Task */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight dark:text-white">
              Tarefas & Providências
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {pendingCount} pendentes
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
            Acompanhamento de prazos internos, juntadas de laudos e diligências dos clientes.
          </p>
        </div>

        <button
          id="btn-new-task"
          onClick={() => setIsNewTaskModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D97706] hover:bg-[#b45309] text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto hover:shadow-md active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Metric Cards for Tasks */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => setFilterStatus('pendentes')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-blue-500 cursor-pointer hover:shadow-xs transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Em Aberto</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {pendingCount}
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('urgentes')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-rose-500 cursor-pointer hover:shadow-xs transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Urgentes</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {urgentCount}
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('concluidas')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs border-l-4 border-l-emerald-500 cursor-pointer hover:shadow-xs transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {completedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por descrição da tarefa ou cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8fafc] dark:bg-slate-900 text-sm text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>

          {[
            { id: 'todas', label: `Todas (${allTasks.length})` },
            { id: 'pendentes', label: `Pendentes (${pendingCount})` },
            { id: 'urgentes', label: `Urgentes (${urgentCount})` },
            { id: 'concluidas', label: `Concluídas (${completedCount})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                filterStatus === item.id
                  ? 'bg-[#091426] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 pb-8">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-dashed border-gray-300 dark:border-slate-700 space-y-2">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto opacity-70" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Nenhuma tarefa encontrada neste filtro! 🎉
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Todas as providências selecionadas estão em dia ou não há itens cadastrados.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            let priorityBadge = 'bg-blue-50 text-blue-700 border-blue-200';
            if (task.priority === 'Urgente') {
              priorityBadge = 'bg-rose-50 text-rose-700 border-rose-200';
            } else if (task.priority === 'Média') {
              priorityBadge = 'bg-amber-50 text-amber-700 border-amber-200';
            }

            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs ${
                  task.done
                    ? 'border-gray-200 opacity-60 bg-gray-50/70 dark:bg-slate-800/40'
                    : 'border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id, task.clientId)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                      task.done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 hover:border-amber-500 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {task.done && <CheckSquare className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold transition-all ${
                        task.done
                          ? 'line-through text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                        <User className="w-3.5 h-3.5" />
                        {task.clientName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Prazo: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${priorityBadge}`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleDeleteTask(task.id, task.clientId)}
                    title="Excluir tarefa"
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-5 shadow-xl border border-gray-200 dark:border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Nova Tarefa / Providência
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Vincular a Cliente *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  disabled={clients.length === 0}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-60"
                >
                  {clients.length === 0 ? (
                    <option value="">Nenhum cliente cadastrado</option>
                  ) : (
                    clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.benefitType})
                      </option>
                    ))
                  )}
                </select>
                {clients.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Cadastre um cliente primeiro para poder vincular tarefas a ele.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Descrição da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Acompanhar agendamento da perícia médica"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Data Limite *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Prioridade *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Média">Média</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#D97706] hover:bg-[#b45309] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Adicionar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
