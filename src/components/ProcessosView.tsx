import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { LawCase } from '../types';

interface ProcessosViewProps {
  cases: LawCase[];
  onSelectCase: (c: LawCase) => void;
  onOpenNewCase: () => void;
}

export const ProcessosView: React.FC<ProcessosViewProps> = ({
  cases,
  onSelectCase,
  onOpenNewCase,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    'Todos',
    'Em Exigência',
    'Aguardando Perícia',
    'Em Andamento',
    'Concedido',
  ];

  const filteredCases = cases.filter((c) => {
    if (selectedStatus !== 'Todos' && c.status !== selectedStatus) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.number.toLowerCase().includes(q) ||
        c.benefitType.toLowerCase().includes(q) ||
        (c.inssProtocol && c.inssProtocol.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Title & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
            Processos & Requerimentos
          </h1>
          <p className="text-sm text-[#45474c]">
            Acompanhamento processual judicial e administrativo junto ao INSS Digital.
          </p>
        </div>

        <button
          id="btn-processos-new-case"
          onClick={onOpenNewCase}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#091426] hover:bg-[#1e293b] text-white font-medium text-sm rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Processo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#f2f4f6] rounded-2xl p-3.5 border border-[#E2E8F0] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#75777d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-processos-search"
            type="text"
            placeholder="Buscar por cliente, número do CNJ ou protocolo INSS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-sm text-[#191c1e] pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#75777d] font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {statusOptions.map((status) => {
            const count =
              status === 'Todos'
                ? cases.length
                : cases.filter((c) => c.status === status).length;
            const isSelected = selectedStatus === status;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#091426] text-white shadow-xs'
                    : 'bg-white text-[#45474c] hover:bg-gray-100 border border-[#E2E8F0]'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Case List */}
      <div className="space-y-3 pb-8">
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] space-y-2">
            <FolderOpen className="w-10 h-10 text-[#75777d] mx-auto opacity-50" />
            <p className="text-sm font-semibold text-[#191c1e]">
              Nenhum processo encontrado
            </p>
            <p className="text-xs text-[#45474c]">
              Tente alterar os termos da busca ou selecionar outro status.
            </p>
          </div>
        ) : (
          filteredCases.map((c) => {
            const completedChecks = c.checklist.filter((chk) => chk.done).length;
            const totalChecks = c.checklist.length;

            const isExigencia = c.status === 'Em Exigência';
            const isConcedido = c.status === 'Concedido';
            const isPericia = c.status === 'Aguardando Perícia';

            let statusBadge = 'bg-blue-50 text-blue-800 border-blue-200';
            if (isExigencia) statusBadge = 'bg-amber-100 text-amber-900 border-amber-300';
            if (isConcedido) statusBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
            if (isPericia) statusBadge = 'bg-purple-100 text-purple-900 border-purple-300';

            return (
              <div
                key={c.id}
                id={`case-card-${c.id}`}
                onClick={() => onSelectCase(c)}
                className="bg-white rounded-2xl p-4 md:p-5 border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#091426] bg-[#f2f4f6] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                      {c.number}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusBadge}`}
                    >
                      {c.status}
                    </span>
                    {c.urgency === 'Urgente' && (
                      <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Urgente
                      </span>
                    )}
                  </div>

                  {c.deadlineDate && (
                    <div className="text-xs text-[#75777d] flex items-center gap-1 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Prazo: {c.deadlineDate}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#191c1e] group-hover:text-[#D97706] transition-colors">
                    {c.clientName}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-[#45474c]">
                    {c.benefitType} • <span className="text-[#75777d]">{c.court}</span>
                  </p>
                </div>

                <p className="text-xs text-[#45474c] bg-[#f7f9fb] p-2.5 rounded-xl border border-[#E2E8F0] line-clamp-2">
                  <span className="font-semibold text-[#191c1e]">Último andamento: </span>
                  {c.lastUpdate}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#f2f4f6] text-xs">
                  <span className="text-[#75777d] flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#D97706]" />
                    Documentos: {completedChecks}/{totalChecks} completos
                  </span>

                  <span className="text-[#D97706] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
