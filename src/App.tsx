/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TabType,
  Activity,
  Client,
  LawCase,
  NotificationItem,
  InssRequirement,
  AppUser,
  ReminderItem,
} from './types';
import {
  INITIAL_CLIENTS,
  INITIAL_ACTIVITIES,
  INITIAL_CASES,
  INITIAL_INSS_REQUIREMENTS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { APP_USERS, DEFAULT_PASSWORD } from './data/users';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { ProcessosView } from './components/ProcessosView';
import { ClientesView } from './components/ClientesView';
import { TarefasView } from './components/TarefasView';
import { MeuInssView } from './components/MeuInssView';
import { NovoClienteModal } from './components/modals/NovoClienteModal';
import { NovoAgendamentoModal } from './components/modals/NovoAgendamentoModal';
import { DetalhesAtividadeModal } from './components/modals/DetalhesAtividadeModal';
import { DetalhesProcessoModal } from './components/modals/DetalhesProcessoModal';
import { NotificacoesDrawer } from './components/modals/NotificacoesDrawer';
import { PerfilModal } from './components/modals/PerfilModal';
import { ChatModal } from './components/modals/ChatModal';

export default function App() {
  // Authentication state - defaults to Felipe Lemos (as seen in screenshot)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('workday_logged_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.username && APP_USERS[parsed.username]) {
          return APP_USERS[parsed.username];
        }
        if (parsed?.role && APP_USERS[parsed.role]) {
          return APP_USERS[parsed.role];
        }
        return parsed;
      } catch {
        return APP_USERS.felipe;
      }
    }
    return APP_USERS.felipe;
  });

  // User passwords map (default Workday@2026)
  const [passwordMap, setPasswordMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('workday_passwords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      felipe: DEFAULT_PASSWORD,
      estagiario: DEFAULT_PASSWORD,
      secretaria: DEFAULT_PASSWORD,
      advogada: DEFAULT_PASSWORD,
    };
  });

  // Navigation: matches screenshot tabs
  const [activeTab, setActiveTab] = useState<TabType>('inicio');

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('workday_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('workday_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('workday_theme', 'light');
    }
  }, [isDarkMode]);

  // Data states with localStorage initialization
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('workday_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('workday_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [cases, setCases] = useState<LawCase[]>(() => {
    const saved = localStorage.getItem('workday_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [inssRequirements, setInssRequirements] = useState<InssRequirement[]>(() => {
    const saved = localStorage.getItem('workday_inss_reqs');
    return saved ? JSON.parse(saved) : INITIAL_INSS_REQUIREMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('workday_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Reminders state: empty by default to display "Sem lembretes pendentes. 🎉" like screenshot
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('workday_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal & focus states
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);
  const [initialClientForActivity, setInitialClientForActivity] = useState<string | undefined>();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedCase, setSelectedCase] = useState<LawCase | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Persist states
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('workday_logged_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('workday_logged_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('workday_passwords', JSON.stringify(passwordMap));
  }, [passwordMap]);

  useEffect(() => {
    localStorage.setItem('workday_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('workday_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('workday_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('workday_inss_reqs', JSON.stringify(inssRequirements));
  }, [inssRequirements]);

  useEffect(() => {
    localStorage.setItem('workday_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('workday_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Auth Handlers
  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    showToast(`Bem-vindo ao Workday, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('inicio');
    showToast('Sessão encerrada.');
  };

  const handleChangePassword = (username: string, newPass: string) => {
    setPasswordMap((prev) => ({
      ...prev,
      [username]: newPass,
    }));
    showToast(`Senha do usuário "${username}" atualizada com sucesso!`);
  };

  const handleUpdateUserName = (newName: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, name: newName };
      setCurrentUser(updatedUser);
      showToast(`Nome de exibição alterado para "${newName}".`);
    }
  };

  // Reminders Handlers
  const handleAddReminder = (title: string) => {
    const newRem: ReminderItem = {
      id: 'rem_' + Date.now(),
      title,
      done: false,
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast('Lembrete adicionado!');
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Lembrete removido.');
  };

  // Business Handlers
  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    showToast(`Cliente "${newClient.name}" cadastrado com sucesso!`);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    showToast(`Ficha de "${updatedClient.name}" atualizada!`);
  };

  const handleOpenNewActivityForClient = (client: Client) => {
    setInitialClientForActivity(client.name);
    setIsNewActivityOpen(true);
  };

  const handleAddActivity = (newActivity: Activity) => {
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`Compromisso "${newActivity.title}" agendado na Agenda Eletrônica!`);
  };

  const handleToggleActivityComplete = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const updated = !act.completed;
          showToast(
            updated
              ? `Compromisso "${act.title}" marcado como realizado!`
              : `Compromisso "${act.title}" reaberto na agenda!`
          );
          return { ...act, completed: updated };
        }
        return act;
      })
    );
    if (selectedActivity && selectedActivity.id === id) {
      setSelectedActivity((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
    }
  };

  const handleToggleChecklistItem = (caseId: string, checkId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedChecklist = c.checklist.map((chk) =>
            chk.id === checkId ? { ...chk, done: !chk.done } : chk
          );
          return { ...c, checklist: updatedChecklist };
        }
        return c;
      })
    );
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          checklist: prev.checklist.map((chk) =>
            chk.id === checkId ? { ...chk, done: !chk.done } : chk
          ),
        };
      });
    }
  };

  const handleResolveRequirement = (id: string) => {
    setInssRequirements((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Respondida' } : req
      )
    );
    showToast('Exigência cumprida! Protocolo de juntada emitido.');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas as notificações foram marcadas como lidas.');
  };

  const handleMarkNotificationItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // If not authenticated, render LoginScreen
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        currentPasswordMap={passwordMap}
      />
    );
  }

  const urgentInssCount = inssRequirements.filter((r) => r.status === 'Pendente').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#091426] text-white px-4 py-3 rounded-2xl shadow-xl border border-amber-500/30 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#D97706]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header with integrated tabs, search, chat, dark mode, bell & user avatar */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        clients={clients}
        onOpenChat={() => setIsChatModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 w-full pb-12">
        {activeTab === 'inicio' && (
          <DashboardView
            lawyerName={currentUser.name}
            activities={activities}
            onNavigateTab={setActiveTab}
            onOpenNewClient={() => setIsNewClientOpen(true)}
            onOpenNewActivity={() => {
              setInitialClientForActivity(undefined);
              setIsNewActivityOpen(true);
            }}
            onSelectActivity={setSelectedActivity}
            onSelectCase={setSelectedCase}
            totalClients={clients.length}
            totalCases={cases.length}
            urgentInssCount={urgentInssCount}
            cases={cases}
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView
            activities={activities}
            onOpenNewActivity={() => {
              setInitialClientForActivity(undefined);
              setIsNewActivityOpen(true);
            }}
            onSelectActivity={setSelectedActivity}
            onToggleComplete={handleToggleActivityComplete}
          />
        )}

        {activeTab === 'clientes' && (
          <ClientesView
            clients={clients}
            onOpenNewClient={() => setIsNewClientOpen(true)}
            onUpdateClient={handleUpdateClient}
            onOpenNewActivityForClient={handleOpenNewActivityForClient}
            allActivities={activities}
            allCases={cases}
            onSelectActivity={setSelectedActivity}
            onSelectCase={setSelectedCase}
          />
        )}

        {activeTab === 'tarefas' && (
          <TarefasView
            clients={clients}
            onUpdateClient={handleUpdateClient}
            onNavigateToClient={(cId) => {
              const target = clients.find((c) => c.id === cId);
              if (target) {
                setActiveTab('clientes');
              }
            }}
          />
        )}

        {activeTab === 'processos' && (
          <ProcessosView
            cases={cases}
            onSelectCase={setSelectedCase}
            onOpenNewCase={() => setIsNewClientOpen(true)}
          />
        )}

        {activeTab === 'meu_inss' && (
          <MeuInssView
            requirements={inssRequirements}
            onResolveRequirement={handleResolveRequirement}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <NovoClienteModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onAddClient={handleAddClient}
      />

      <NovoAgendamentoModal
        isOpen={isNewActivityOpen}
        onClose={() => {
          setIsNewActivityOpen(false);
          setInitialClientForActivity(undefined);
        }}
        onAddActivity={handleAddActivity}
        clients={clients}
        initialClientName={initialClientForActivity}
      />

      <DetalhesAtividadeModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onToggleComplete={handleToggleActivityComplete}
      />

      <DetalhesProcessoModal
        lawCase={selectedCase}
        onClose={() => setSelectedCase(null)}
        onToggleChecklistItem={handleToggleChecklistItem}
      />

      <NotificacoesDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onMarkItemAsRead={handleMarkNotificationItemRead}
      />

      <PerfilModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onSaveName={handleUpdateUserName}
        onChangePassword={handleChangePassword}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        clients={clients}
      />
    </div>
  );
}
