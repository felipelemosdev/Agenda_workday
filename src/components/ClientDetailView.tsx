import React, { useState } from 'react';
import {
  ChevronLeft,
  Edit3,
  Phone,
  Calendar,
  FileText,
  CheckSquare,
  FolderOpen,
  History,
  Activity as ActivityIcon,
  Plus,
  Upload,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import {
  Client,
  Activity,
  LawCase,
  ClientDocument,
  ClientTask,
  ClientHistoryEvent,
  ClientProceeding,
} from '../types';

interface ClientDetailViewProps {
  client: Client;
  onBack: () => void;
  onUpdateClient: (updated: Client) => void;
  onOpenEditModal: () => void;
  onOpenNewActivityForClient: (client: Client) => void;
  allActivities: Activity[];
  allCases: LawCase[];
  onSelectActivity: (act: Activity) => void;
  onSelectCase: (lawCase: LawCase) => void;
}

type ClientSubTab =
  | 'resumo'
  | 'agenda'
  | 'documentos'
  | 'tarefas'
  | 'processos'
  | 'historico'
  | 'andamentos';

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client,
  onBack,
  onUpdateClient,
  onOpenEditModal,
  onOpenNewActivityForClient,
  allActivities,
  allCases,
  onSelectActivity,
  onSelectCase,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ClientSubTab>('resumo');
  const [copiedGov, setCopiedGov] = useState(false);
  const [showGovPassword, setShowGovPassword] = useState(true);

  // Quick form states for sub-tabs
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<
    'Atendimento' | 'Ligação' | 'WhatsApp' | 'Perícia' | 'Protocolo' | 'Nota Interna'
  >('Atendimento');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Urgente' | 'Média' | 'Normal'>('Normal');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<
    'Identificação' | 'Laudo Médico' | 'CNIS' | 'Procuração' | 'Outros'
  >('Laudo Médico');

  const [isAddingProceeding, setIsAddingProceeding] = useState(false);
  const [newProcTitle, setNewProcTitle] = useState('');
  const [newProcCourt, setNewProcCourt] = useState('Portal Meu INSS Digital');
  const [newProcDetails, setNewProcDetails] = useState('');

  // Filter activities related to this client
  const clientActivities = allActivities.filter(
    (act) =>
      act.clientId === client.id ||
      act.clientName?.toLowerCase().trim() === client.name?.toLowerCase().trim()
  );

  // Filter cases related to this client
  const clientCases = allCases.filter(
    (c) =>
      c.clientId === client.id ||
      c.clientName?.toLowerCase().trim() === client.name?.toLowerCase().trim()
  );

  const handleCopyGov = () => {
    if (client.govPassword) {
      navigator.clipboard.writeText(client.govPassword);
      setCopiedGov(true);
      setTimeout(() => setCopiedGov(false), 2000);
    }
  };

  // Toggle task complete
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = (client.tasks || []).map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    onUpdateClient({ ...client, tasks: updatedTasks });
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ClientTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: newTaskDate || new Date().toLocaleDateString('pt-BR'),
      done: false,
      priority: newTaskPriority,
    };

    onUpdateClient({
      ...client,
      tasks: [newTask, ...(client.tasks || [])],
    });

    setNewTaskTitle('');
    setNewTaskDate('');
    setIsAddingTask(false);
  };

  // Add new history note
  const handleAddHistoryNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const now = new Date();
    const newEvent: ClientHistoryEvent = {
      id: `hist-${Date.now()}`,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      author: 'Equipe Workday',
      category: newNoteCategory,
      description: newNoteText.trim(),
    };

    onUpdateClient({
      ...client,
      history: [newEvent, ...(client.history || [])],
    });

    setNewNoteText('');
  };

  // Add document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const newDoc: ClientDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      category: newDocCategory,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'Anexado',
      fileName: `${newDocTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    };

    onUpdateClient({
      ...client,
      documents: [newDoc, ...(client.documents || [])],
    });

    setNewDocTitle('');
    setIsAddingDoc(false);
  };

  // Add proceeding
  const handleAddProceeding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcTitle.trim()) return;

    const newProc: ClientProceeding = {
      id: `proc-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      courtOrInss: newProcCourt,
      title: newProcTitle.trim(),
      details: newProcDetails.trim() || 'Movimentação registrada pela equipe jurídica.',
      status: 'Em Andamento',
    };

    onUpdateClient({
      ...client,
      proceedings: [newProc, ...(client.proceedings || [])],
    });

    setNewProcTitle('');
    setNewProcDetails('');
    setIsAddingProceeding(false);
  };

  const rawPhone = client.phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${rawPhone}?text=Ol%C3%A1%2C%20${encodeURIComponent(
    client.name
  )}%21%20Aqui%20%C3%A9%20da%20Advocacia%20Workday%20sobre%20seu%20atendimento.`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 space-y-5">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-clients"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#45474c] hover:text-[#191c1e] transition-colors cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Clientes</span>
        </button>

        <button
          id="btn-edit-client"
          onClick={onOpenEditModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f2f4f6] text-[#191c1e] font-medium text-xs rounded-xl border border-[#E2E8F0] shadow-2xs transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#45474c]" />
          <span>Editar</span>
        </button>
      </div>

      {/* Client Header matching image.png */}
      <div className="space-y-2">
        <h1
          id="client-detail-name"
          className="text-2xl md:text-3xl font-bold tracking-tight text-[#191c1e]"
        >
          {client.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-[#45474c]">
          <span className="font-normal text-[#191c1e]">
            CPF: <span className="text-[#45474c]">{client.cpf}</span>
          </span>

          <a
            href={`tel:${client.phone}`}
            className="inline-flex items-center gap-1 text-[#191c1e] hover:text-[#D97706] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#75777d]" />
            <span>{client.phone}</span>
          </a>

          {client.govPassword && (
            <span className="text-[#191c1e]">
              Gov.: <span className="font-medium text-[#45474c]">{client.govPassword}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {client.status || 'Ativo'}
          </span>
        </div>
      </div>

      {/* Sub-tab navigation matching image.png */}
      <div className="border-b border-[#E2E8F0] pb-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {(
            [
              { id: 'resumo' as ClientSubTab, label: 'Resumo' },
              { id: 'agenda' as ClientSubTab, label: 'Agenda', count: clientActivities.length },
              { id: 'documentos' as ClientSubTab, label: 'Documentos', count: client.documents?.length },
              { id: 'tarefas' as ClientSubTab, label: 'Tarefas', count: client.tasks?.filter((t) => !t.done).length },
              { id: 'processos' as ClientSubTab, label: 'Processos', count: clientCases.length },
              { id: 'historico' as ClientSubTab, label: 'Histórico' },
              { id: 'andamentos' as ClientSubTab, label: 'Andamentos' },
            ] as { id: ClientSubTab; label: string; count?: number }[]
          ).map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`subtab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'border-2 border-[#191c1e] bg-white text-[#191c1e] font-semibold shadow-2xs'
                    : 'text-[#45474c] hover:text-[#191c1e] hover:bg-[#f2f4f6]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#191c1e] text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: Resumo (Exact layout of image.png) */}
      {activeSubTab === 'resumo' && (
        <div className="space-y-6">
          {/* 6 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Telefone */}
            <div
              id="card-info-telefone"
              className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                    Telefone
                  </span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                  title="Conversar no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
              <p className="text-base md:text-lg font-semibold text-[#191c1e]">
                {client.phone || '—'}
              </p>
            </div>

            {/* Card 2: GOV. */}
            <div
              id="card-info-gov"
              className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                    Gov.
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowGovPassword(!showGovPassword)}
                    className="text-[#75777d] hover:text-[#191c1e] p-1 rounded-md hover:bg-gray-100 transition-colors"
                    title={showGovPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showGovPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyGov}
                    className="text-[#75777d] hover:text-[#191c1e] p-1 rounded-md hover:bg-gray-100 transition-colors"
                    title="Copiar senha Gov"
                  >
                    {copiedGov ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-base md:text-lg font-semibold text-[#191c1e] font-mono">
                {client.govPassword ? (showGovPassword ? client.govPassword : '••••••••') : '—'}
              </p>
            </div>

            {/* Card 3: E-mail */}
            <div
              id="card-info-email"
              className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  E-mail
                </span>
              </div>
              <p className="text-base md:text-lg font-semibold text-[#191c1e] truncate">
                {client.email ? client.email : '—'}
              </p>
            </div>

            {/* Card 4: Benefício / Atendimento */}
            <div
              id="card-info-beneficio"
              className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Benefício / Atendimento
                </span>
              </div>
              <p className="text-base md:text-lg font-bold text-[#191c1e] uppercase">
                {client.benefitType || 'BPC DEFICIENTE'}
              </p>
            </div>

            {/* Card 5: Origem da Indicação */}
            <div
              id="card-info-origem"
              className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Origem da Indicação
                </span>
              </div>
              <p className="text-base md:text-lg font-semibold text-[#191c1e]">
                {client.originIndication ? client.originIndication : '—'}
              </p>
            </div>

            {/* Card 6: Situação */}
            <div
              id="card-info-situacao"
              className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Situação
                </span>
              </div>
              <p className="text-base md:text-lg font-semibold text-emerald-700">
                {client.status || 'Ativo'}
              </p>
            </div>
          </div>

          {/* Additional Notes Box */}
          {client.notes && (
            <div className="bg-[#f7f9fb] rounded-2xl p-4 md:p-5 border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">
                Observações do Cliente & Estratégia
              </span>
              <p className="text-sm text-[#45474c] leading-relaxed">
                {client.notes}
              </p>
            </div>
          )}

          {/* Quick Agenda & Upcoming Tasks preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Next Agenda Event */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D97706]" />
                  Compromisso Mais Próximo
                </h3>
                <button
                  onClick={() => setActiveSubTab('agenda')}
                  className="text-xs text-[#D97706] font-medium hover:underline"
                >
                  Ver todos
                </button>
              </div>

              {clientActivities.length > 0 ? (
                <div
                  onClick={() => onSelectActivity(clientActivities[0])}
                  className="p-3 bg-[#f7f9fb] rounded-xl border border-[#E2E8F0] hover:bg-[#eceef0] cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D97706]">
                      {clientActivities[0].date} às {clientActivities[0].time}h
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                      {clientActivities[0].type}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#191c1e]">
                    {clientActivities[0].title}
                  </p>
                  <p className="text-xs text-[#45474c]">
                    {clientActivities[0].varaOrChannel || clientActivities[0].details}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#75777d]">
                  Nenhum compromisso agendado para este cliente.
                </div>
              )}
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#D97706]" />
                  Tarefas Pendentes
                </h3>
                <button
                  onClick={() => setActiveSubTab('tarefas')}
                  className="text-xs text-[#D97706] font-medium hover:underline"
                >
                  Ver tarefas
                </button>
              </div>

              {client.tasks && client.tasks.filter((t) => !t.done).length > 0 ? (
                <div className="space-y-2">
                  {client.tasks
                    .filter((t) => !t.done)
                    .slice(0, 2)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#E2E8F0]"
                      >
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => handleToggleTask(t.id)}
                          className="w-4 h-4 rounded text-[#D97706] focus:ring-[#D97706]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#191c1e] truncate">
                            {t.title}
                          </p>
                          <span className="text-[10px] text-[#75777d]">
                            Prazo: {t.dueDate}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#75777d]">
                  Nenhuma tarefa pendente no momento.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Agenda Eletrônica do Cliente */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                Agenda de {client.name}
              </h2>
              <p className="text-xs text-[#75777d]">
                Perícias médicas, audiências, reuniões e prazos fatais vinculados a este segurado.
              </p>
            </div>

            <button
              id="btn-add-activity-client"
              onClick={() => onOpenNewActivityForClient(client)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D97706] hover:bg-[#b45309] text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agendar para este Cliente</span>
            </button>
          </div>

          {clientActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] space-y-2">
              <Calendar className="w-10 h-10 text-[#75777d] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#191c1e]">
                Nenhum compromisso agendado para este cliente
              </p>
              <p className="text-xs text-[#45474c]">
                Clique no botão acima para agendar uma perícia médica, audiência ou reunião.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {clientActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act)}
                  className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#091426]/10 text-[#091426] flex flex-col items-center justify-center font-medium shrink-0 leading-none">
                      <span className="text-xs font-bold">{act.time}</span>
                      <span className="text-[10px] text-[#45474c] mt-0.5">
                        {act.date.split('-').reverse().slice(0, 2).join('/')}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#191c1e] group-hover:text-[#D97706] transition-colors">
                          {act.title}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#904d00] border border-amber-200">
                          {act.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#45474c]">
                        {act.varaOrChannel || act.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {act.completed ? (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-semibold">
                        Realizado
                      </span>
                    ) : (
                      <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-semibold">
                        Agendado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Documentos */}
      {activeSubTab === 'documentos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                Documentos e Laudos
              </h2>
              <p className="text-xs text-[#75777d]">
                Repositório de identidade, laudos médicos com CID, extrato CNIS e procurações.
              </p>
            </div>

            <button
              id="btn-add-document"
              onClick={() => setIsAddingDoc(!isAddingDoc)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#091426] hover:bg-[#1e293b] text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Anexar Documento</span>
            </button>
          </div>

          {/* Form to add document */}
          {isAddingDoc && (
            <form
              onSubmit={handleAddDocument}
              className="bg-white rounded-2xl p-4 border border-[#D97706]/40 shadow-xs space-y-3"
            >
              <h3 className="text-xs font-bold text-[#191c1e] uppercase">
                Adicionar Novo Documento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#45474c] mb-1">
                    Nome do Documento / Laudo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Laudo Médico Reumatologista 2026"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#45474c] mb-1">
                    Categoria
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  >
                    <option value="Identificação">Identificação (RG / CPF)</option>
                    <option value="Laudo Médico">Laudo Médico / Atestados</option>
                    <option value="CNIS">Extrato CNIS</option>
                    <option value="Procuração">Procuração & Contrato</option>
                    <option value="Outros">Outros Documentos</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="px-3 py-1.5 text-xs text-[#45474c] hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#D97706] text-white rounded-xl font-semibold hover:bg-[#b45309]"
                >
                  Salvar Documento
                </button>
              </div>
            </form>
          )}

          {/* Document list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(client.documents || []).map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-[#191c1e]">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-[#75777d]">
                      {doc.category} • Anexado em {doc.date}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Tarefas */}
      {activeSubTab === 'tarefas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                Tarefas e Diligências
              </h2>
              <p className="text-xs text-[#75777d]">
                Checklist de providências internas do escritório para este caso.
              </p>
            </div>

            <button
              id="btn-add-task"
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D97706] hover:bg-[#b45309] text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Tarefa</span>
            </button>
          </div>

          {/* Add task form */}
          {isAddingTask && (
            <form
              onSubmit={handleAddTask}
              className="bg-white rounded-2xl p-4 border border-[#D97706]/40 shadow-xs space-y-3"
            >
              <h3 className="text-xs font-bold text-[#191c1e] uppercase">
                Adicionar Nova Tarefa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#45474c] mb-1">
                    Descrição da Tarefa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cobrar resposta do CRAS sobre CadÚnico"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#45474c] mb-1">
                    Prazo Limite
                  </label>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 text-xs text-[#45474c] hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#D97706] text-white rounded-xl font-semibold hover:bg-[#b45309]"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          )}

          {/* Task list */}
          <div className="space-y-2">
            {(client.tasks || []).map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs flex items-center justify-between transition-all ${
                  t.done ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => handleToggleTask(t.id)}
                    className="w-5 h-5 rounded text-[#D97706] focus:ring-[#D97706] cursor-pointer"
                  />
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        t.done ? 'line-through text-gray-500' : 'text-[#191c1e]'
                      }`}
                    >
                      {t.title}
                    </h3>
                    <p className="text-xs text-[#75777d]">
                      Prazo: {t.dueDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    t.priority === 'Urgente'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Processos */}
      {activeSubTab === 'processos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                Processos do Cliente
              </h2>
              <p className="text-xs text-[#75777d]">
                Requerimentos administrativos no Meu INSS e ações judiciais cíveis/federais.
              </p>
            </div>
          </div>

          {clientCases.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] space-y-2">
              <FolderOpen className="w-10 h-10 text-[#75777d] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#191c1e]">
                Nenhum processo vinculado a este segurado
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#D97706] transition-colors">
                        {c.number}
                      </h3>
                      <p className="text-xs text-[#75777d]">
                        {c.court} • {c.benefitType}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#45474c] bg-[#f7f9fb] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <span className="font-semibold text-[#191c1e]">Último Andamento: </span>
                    {c.lastUpdate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Histórico */}
      {activeSubTab === 'historico' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                Histórico de Atendimentos
              </h2>
              <p className="text-xs text-[#75777d]">
                Linha do tempo de atendimentos, ligações, mensagens e anotações internas.
              </p>
            </div>
          </div>

          {/* Quick Note Input */}
          <form
            onSubmit={handleAddHistoryNote}
            className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#191c1e] uppercase">
                Registrar Novo Atendimento / Contato
              </span>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as any)}
                className="text-xs p-1 rounded-lg border border-[#E2E8F0]"
              >
                <option value="Atendimento">Atendimento Presencial</option>
                <option value="Ligação">Ligação Telefônica</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Perícia">Perícia</option>
                <option value="Protocolo">Protocolo</option>
                <option value="Nota Interna">Nota Interna</option>
              </select>
            </div>

            <textarea
              required
              rows={2}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Descreva o que foi tratado com o cliente ou o andamento realizado..."
              className="w-full text-xs p-3 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-[#091426] text-white rounded-xl font-semibold hover:bg-[#1e293b] cursor-pointer"
              >
                Registrar no Histórico
              </button>
            </div>
          </form>

          {/* Timeline */}
          <div className="space-y-3 relative pl-4 border-l-2 border-gray-200">
            {(client.history || []).map((h) => (
              <div key={h.id} className="relative pl-3 space-y-1">
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#D97706] ring-4 ring-white" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#191c1e]">
                    {h.date} {h.time ? `às ${h.time}` : ''}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-800 px-1.5 py-0.2 rounded font-medium">
                    {h.category}
                  </span>
                  <span className="text-[10px] text-[#75777d]">por {h.author}</span>
                </div>
                <p className="text-xs md:text-sm text-[#45474c] bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Andamentos */}
      {activeSubTab === 'andamentos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                Andamentos & Movimentações
              </h2>
              <p className="text-xs text-[#75777d]">
                Movimentações oficiais do INSS e do Poder Judiciário.
              </p>
            </div>

            <button
              id="btn-add-proceeding"
              onClick={() => setIsAddingProceeding(!isAddingProceeding)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D97706] hover:bg-[#b45309] text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Andamento</span>
            </button>
          </div>

          {/* Add Proceeding Form */}
          {isAddingProceeding && (
            <form
              onSubmit={handleAddProceeding}
              className="bg-white rounded-2xl p-4 border border-[#D97706]/40 shadow-xs space-y-3"
            >
              <h3 className="text-xs font-bold text-[#191c1e] uppercase">
                Registrar Movimentação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#45474c] mb-1">
                    Título da Movimentação
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Laudo Pericial Juntado aos Autos"
                    value={newProcTitle}
                    onChange={(e) => setNewProcTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#45474c] mb-1">
                    Órgão / Tribunal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Agência INSS Digital ou JFSP"
                    value={newProcCourt}
                    onChange={(e) => setNewProcCourt(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#45474c] mb-1">
                  Detalhes da Movimentação
                </label>
                <textarea
                  rows={2}
                  value={newProcDetails}
                  onChange={(e) => setNewProcDetails(e.target.value)}
                  placeholder="Detalhes sobre prazo, despacho ou publicação..."
                  className="w-full text-xs p-2 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#D97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProceeding(false)}
                  className="px-3 py-1.5 text-xs text-[#45474c] hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#D97706] text-white rounded-xl font-semibold hover:bg-[#b45309]"
                >
                  Salvar Andamento
                </button>
              </div>
            </form>
          )}

          {/* Proceedings list */}
          <div className="space-y-3">
            {(client.proceedings || []).map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#191c1e]">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-[#75777d]">
                      • {p.courtOrInss}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#D97706]">
                    {p.date}
                  </span>
                </div>
                <p className="text-xs text-[#45474c] leading-relaxed">
                  {p.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
