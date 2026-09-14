import React from 'react';
import { Home, Calendar, FolderOpen, Users, ShieldCheck } from 'lucide-react';
import { TabType, UserRole } from '../types';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  urgentInssCount?: number;
  userRole: UserRole;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  urgentInssCount = 0,
}) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Início', icon: Home },
    { id: 'agenda' as TabType, label: 'Agenda Eletrônica', icon: Calendar },
    { id: 'clientes' as TabType, label: 'Clientes', icon: Users },
    { id: 'processos' as TabType, label: 'Processos', icon: FolderOpen },
    {
      id: 'meu_inss' as TabType,
      label: 'Meu INSS',
      icon: ShieldCheck,
      badge: urgentInssCount > 0 ? urgentInssCount : undefined,
    },
  ];

  return (
    <nav className="w-full bg-[#f7f9fb] border-b border-[#E2E8F0] overflow-x-auto no-scrollbar px-4 md:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'text-[#D97706] bg-[#f2f4f6] shadow-xs font-semibold'
                  : 'text-[#45474c] hover:text-[#191c1e] hover:bg-[#eceef0]'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#D97706]' : 'text-[#75777d]'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-[#fe932c]/20 text-[#904d00] text-[11px] font-semibold rounded-md">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
