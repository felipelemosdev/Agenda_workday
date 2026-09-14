import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Scale,
  Search,
  MessageCircle,
  Moon,
  Sun,
  LogOut,
  User,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { AppUser, NotificationItem, TabType, Client } from '../types';

interface HeaderProps {
  currentUser: AppUser;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  clients: Client[];
  onSelectClient?: (client: Client) => void;
  onOpenChat: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onOpenNotifications,
  onOpenProfile,
  onLogout,
  notifications,
  clients,
  onSelectClient,
  onOpenChat,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter clients for quick search dropdown
  const matchedClients = searchQuery.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.cpf.includes(searchQuery) ||
          (c.benefitType && c.benefitType.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs = [
    { id: 'inicio' as TabType, label: 'INÍCIO' },
    { id: 'agenda' as TabType, label: 'AGENDA' },
    { id: 'clientes' as TabType, label: 'CLIENTES' },
    { id: 'tarefas' as TabType, label: 'TAREFAS' },
    { id: 'processos' as TabType, label: 'PROCESSOS' },
  ];

  // User initials: "FL" for Felipe Lemos
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = currentUser.name.toLowerCase().includes('felipe')
    ? 'FL'
    : getInitials(currentUser.name);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1528]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 md:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Logo and Brand Name */}
        <div
          onClick={() => onTabChange('inicio')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
        >
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-[#091426] dark:bg-slate-900 border border-amber-500/30 shadow-xs text-amber-500 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-wider font-mono">
            WORKDAY
          </span>
        </div>

        {/* Center: Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer rounded-t-lg relative ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 border-b-2 border-b-amber-500 shadow-2xs -mb-[1px]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search, Chat, Dark Mode, Bell, User Avatar */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Quick Client Search */}
          <div ref={searchRef} className="relative hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Buscar clientes..."
                className="w-44 md:w-60 pl-9 pr-3 py-1.5 text-xs md:text-sm bg-gray-100/80 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Quick search dropdown */}
            {isSearchOpen && matchedClients.length > 0 && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-2 z-50 space-y-1">
                <div className="text-[11px] font-bold text-gray-400 px-2 py-1 uppercase">
                  Clientes encontrados ({matchedClients.length})
                </div>
                {matchedClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      if (onSelectClient) {
                        onSelectClient(client);
                        onTabChange('clientes');
                      }
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {client.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        CPF: {client.cpf} • {client.benefitType}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Chat / WhatsApp */}
          <button
            onClick={onOpenChat}
            title="Atendimento Rápido e WhatsApp"
            aria-label="Atendimento"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label="Alternar tema"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            aria-label="Notificações"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 md:w-4.5 md:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[17px] h-[17px] bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar Circle (FL) */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title={`${currentUser.name} (${currentUser.roleLabel})`}
              className="w-9 h-9 rounded-full bg-[#091426] dark:bg-slate-700 text-white font-black text-xs flex items-center justify-center border-2 border-amber-500/50 hover:border-amber-500 transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-amber-500"
            >
              <span>{userInitials}</span>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {currentUser.roleLabel}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>Perfil & Senha</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair do Workday</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs (Scrollable on small screens) */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100 dark:border-slate-800 mt-2">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded-lg transition-all ${
                isActive
                  ? 'bg-[#091426] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
