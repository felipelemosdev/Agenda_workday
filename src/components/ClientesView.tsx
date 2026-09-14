import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Client, Activity, LawCase } from '../types';
import { ClientDetailView } from './ClientDetailView';
import { EditarClienteModal } from './modals/EditarClienteModal';

interface ClientesViewProps {
  clients: Client[];
  onOpenNewClient: () => void;
  onUpdateClient: (updated: Client) => void;
  onOpenNewActivityForClient: (client: Client) => void;
  allActivities: Activity[];
  allCases: LawCase[];
  onSelectActivity: (act: Activity) => void;
  onSelectCase: (lawCase: LawCase) => void;
  selectedClientId?: string | null;
  onClearSelectedClient?: () => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clients,
  onOpenNewClient,
  onUpdateClient,
  onOpenNewActivityForClient,
  allActivities,
  allCases,
  onSelectActivity,
  onSelectCase,
  selectedClientId,
  onClearSelectedClient,
}) => {
  const [internalSelectedClientId, setInternalSelectedClientId] = useState<string | null>(
    selectedClientId || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Active selected client
  const activeClientId = selectedClientId !== undefined ? selectedClientId : internalSelectedClientId;
  const currentClient = clients.find((c) => c.id === activeClientId) || null;

  const handleSelectClient = (client: Client) => {
    setInternalSelectedClientId(client.id);
  };

  const handleBackToList = () => {
    setInternalSelectedClientId(null);
    if (onClearSelectedClient) {
      onClearSelectedClient();
    }
  };

  // If a client is selected, show the ClientDetailView (which matches image.png)
  if (currentClient) {
    return (
      <>
        <ClientDetailView
          client={currentClient}
          onBack={handleBackToList}
          onUpdateClient={onUpdateClient}
          onOpenEditModal={() => setIsEditModalOpen(true)}
          onOpenNewActivityForClient={onOpenNewActivityForClient}
          allActivities={allActivities}
          allCases={allCases}
          onSelectActivity={onSelectActivity}
          onSelectCase={onSelectCase}
        />

        <EditarClienteModal
          client={currentClient}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onUpdateClient}
        />
      </>
    );
  }

  // Filter clients
  const filteredClients = clients.filter((cli) => {
    if (statusFilter !== 'todos' && cli.status !== statusFilter) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      cli.name.toLowerCase().includes(q) ||
      cli.cpf.includes(q) ||
      cli.phone.includes(q) ||
      (cli.govPassword && cli.govPassword.toLowerCase().includes(q)) ||
      (cli.benefitType && cli.benefitType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Header and Add Client */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#191c1e] tracking-tight">
            Clientes
          </h1>
          <p className="text-sm text-[#45474c]">
            Gestão de segurados, acessos Gov. INSS, laudos médicos, agenda e processos.
          </p>
        </div>

        <button
          id="btn-clientes-new-client"
          onClick={onOpenNewClient}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D97706] hover:bg-[#b45309] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#75777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-clientes-search"
            type="text"
            placeholder="Buscar por nome, CPF, telefone ou tipo de benefício..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f7f9fb] text-sm text-[#191c1e] pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#75777d] font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>

          {['todos', 'Ativo', 'Em Atendimento', 'Aguardando Documentos', 'Benefício Concedido'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#091426] text-white'
                  : 'bg-[#f7f9fb] text-[#45474c] hover:bg-gray-200 border border-[#E2E8F0]'
              }`}
            >
              {status === 'todos' ? `Todos (${clients.length})` : status}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-3 pb-8">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] space-y-2">
            <Users className="w-10 h-10 text-[#75777d] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#191c1e]">
              Nenhum cliente encontrado com os filtros atuais
            </p>
            <p className="text-xs text-[#45474c]">
              Clique no botão "Novo Cliente" para cadastrar um segurado.
            </p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const rawPhone = client.phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/55${rawPhone}?text=Ol%C3%A1%2C%20${encodeURIComponent(
              client.name
            )}%21%20Aqui%20%C3%A9%20da%20Advocacia%20Workday%20sobre%20seu%20atendimento.`;

            // Related activities
            const clientActs = allActivities.filter(
              (a) =>
                a.clientId === client.id ||
                a.clientName?.toLowerCase().trim() === client.name?.toLowerCase().trim()
            );

            return (
              <div
                key={client.id}
                id={`client-card-${client.id}`}
                className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-all space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div
                    onClick={() => handleSelectClient(client)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#D97706] transition-colors flex items-center gap-2">
                        {client.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#75777d]">
                        <span>CPF: {client.cpf}</span>
                        {client.govPassword && (
                          <span>• Gov.: <span className="font-mono">{client.govPassword}</span></span>
                        )}
                        <span>• Tel: {client.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      • {client.status || 'Ativo'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#E2E8F0] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[#75777d] font-medium">Benefício / Atendimento: </span>
                    <span className="text-[#191c1e] font-bold uppercase">
                      {client.benefitType || 'BPC DEFICIENTE'}
                    </span>
                  </div>

                  {clientActs.length > 0 && (
                    <div className="text-[11px] text-[#D97706] font-semibold">
                      Próximo compromisso: {clientActs[0].title} ({clientActs[0].date})
                    </div>
                  )}
                </div>

                {/* Card footer actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>

                    <a
                      href={`tel:${client.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Ligar
                    </a>
                  </div>

                  <button
                    id={`btn-view-client-${client.id}`}
                    onClick={() => handleSelectClient(client)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#191c1e] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Ver Detalhes e Ficha</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
