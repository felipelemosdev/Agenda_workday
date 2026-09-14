import React from 'react';
import {
  X,
  FolderOpen,
  FileCheck,
  CheckSquare,
  Square,
  Clock,
  Building,
  AlertTriangle,
  User,
} from 'lucide-react';
import { LawCase } from '../../types';

interface DetalhesProcessoModalProps {
  lawCase: LawCase | null;
  onClose: () => void;
  onToggleChecklistItem: (caseId: string, checkId: string) => void;
}

export const DetalhesProcessoModal: React.FC<DetalhesProcessoModalProps> = ({
  lawCase,
  onClose,
  onToggleChecklistItem,
}) => {
  if (!lawCase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 md:p-6 shadow-xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-[#D97706]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#191c1e]">Ficha do Processo</h2>
              <span className="font-mono text-xs text-[#75777d]">
                CNJ: {lawCase.number}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Info */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#f7f9fb] rounded-xl border border-[#E2E8F0] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#75777d]">Segurado(a):</span>
              <span className="font-bold text-sm text-[#191c1e]">
                {lawCase.clientName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#75777d]">Benefício:</span>
              <span className="font-semibold text-[#D97706]">
                {lawCase.benefitType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#75777d]">Juízo / Agência:</span>
              <span className="font-medium text-[#191c1e]">{lawCase.court}</span>
            </div>

            {lawCase.inssProtocol && (
              <div className="flex items-center justify-between">
                <span className="text-[#75777d]">Protocolo INSS:</span>
                <span className="font-mono font-medium text-[#091426]">
                  {lawCase.inssProtocol}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
              <span className="text-[#75777d]">Status Atual:</span>
              <span className="font-bold px-2 py-0.5 rounded-md bg-[#091426] text-white">
                {lawCase.status}
              </span>
            </div>
          </div>

          <div>
            <span className="font-bold text-[#191c1e] block mb-1">
              Último Andamento Processual:
            </span>
            <p className="p-3 bg-amber-50/70 border border-amber-200 text-amber-950 rounded-xl leading-relaxed">
              {lawCase.lastUpdate}
            </p>
          </div>

          {/* Documentation checklist */}
          <div className="space-y-2">
            <span className="font-bold text-[#191c1e] flex items-center justify-between">
              <span>Checklist de Documentos Probatórios:</span>
              <span className="text-[11px] text-[#75777d] font-normal">
                Clique para marcar
              </span>
            </span>

            <div className="space-y-1.5">
              {lawCase.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklistItem(lawCase.id, item.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    item.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-[#f7f9fb] border-[#E2E8F0] text-[#191c1e] hover:bg-gray-100'
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#75777d] shrink-0" />
                  )}
                  <span
                    className={`text-xs ${
                      item.done ? 'line-through text-emerald-700' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#091426] hover:bg-[#1e293b] text-white rounded-xl cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
