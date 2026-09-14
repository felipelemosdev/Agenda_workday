import React from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  Calendar,
  CheckCircle2,
  Circle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Activity } from '../../types';

interface DetalhesAtividadeModalProps {
  activity: Activity | null;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}

export const DetalhesAtividadeModal: React.FC<DetalhesAtividadeModalProps> = ({
  activity,
  onClose,
  onToggleComplete,
}) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 md:p-6 shadow-xl border border-[#E2E8F0] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-lg bg-[#091426] text-white">
              {activity.type}
            </span>
            {activity.badge && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  activity.badge === 'Urgente'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-red-100 text-red-900'
                }`}
              >
                {activity.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#191c1e]">{activity.title}</h2>
          <p className="text-xs text-[#D97706] font-medium mt-0.5">
            Horário: {activity.time} • Data: {activity.date}
          </p>
        </div>

        <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#191c1e]">
            <User className="w-4 h-4 text-[#75777d]" />
            <span>
              Cliente: <strong>{activity.clientName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#45474c]">
            <MapPin className="w-4 h-4 text-[#75777d]" />
            <span>Local / Vara: {activity.varaOrChannel || activity.details}</span>
          </div>

          {activity.notes && (
            <div className="pt-2 border-t border-[#E2E8F0]">
              <span className="font-semibold text-[#191c1e] block mb-1">
                Orientações da Pauta:
              </span>
              <p className="text-[#45474c] leading-relaxed">{activity.notes}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
          <button
            onClick={() => onToggleComplete(activity.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activity.completed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-[#091426] text-white hover:bg-[#1e293b]'
            }`}
          >
            {activity.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcado como Concluído</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Marcar como Concluído</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
