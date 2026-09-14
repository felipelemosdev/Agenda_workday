import React from 'react';
import { X, Bell, Check, Clock, AlertTriangle, Gavel } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificacoesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkItemAsRead: (id: string) => void;
}

export const NotificacoesDrawer: React.FC<NotificacoesDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkItemAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-[#E2E8F0]">
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-base font-bold text-[#191c1e]">Notificações</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-[#D97706] hover:underline cursor-pointer font-medium"
            >
              Marcar lidas
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Nenhuma notificação recente.
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.read;

              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkItemAsRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    isUnread
                      ? 'bg-amber-50/50 border-[#D97706]/30'
                      : 'bg-[#f7f9fb] border-[#E2E8F0] opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                      )}
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-[#75777d]">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#45474c] leading-relaxed">
                    {notif.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
