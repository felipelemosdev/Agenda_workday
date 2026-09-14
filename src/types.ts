export type TabType = 'inicio' | 'agenda' | 'clientes' | 'tarefas' | 'processos' | 'meu_inss' | 'auditoria';

export type UserRole = 'estagiario' | 'secretaria' | 'financeiro' | 'advogada' | 'advogado';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW'
  | 'STATUS_CHANGE'
  | 'UPLOAD'
  | 'DOWNLOAD'
  | 'COMPLETE'
  | 'CANCEL';

export type AuditEntity =
  | 'CLIENT'
  | 'APPOINTMENT'
  | 'TASK'
  | 'CASE'
  | 'DOCUMENT'
  | 'HISTORY'
  | 'PROCEEDING'
  | 'INSS_REQUIREMENT'
  | 'USER'
  | 'SYSTEM';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  entityName?: string;
  description: string;
  oldValue?: string | Record<string, any>;
  newValue?: string | Record<string, any>;
  timestamp: string; // ISO 8601 string, e.g. "2026-09-14T08:35:00.000Z"
  metadata?: Record<string, any>;
}

export interface ReminderItem {
  id: string;
  title: string;
  dueDate?: string;
  done: boolean;
  priority?: 'alta' | 'media' | 'baixa';
  category?: string;
}

export interface UserPermissions {
  canManageClients: boolean;
  canManageCases: boolean;
  canManageAgenda: boolean;
  canDeleteRecords: boolean;
  canSignPleadings: boolean;
}

export interface AppUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  title: string;
  permissions: UserPermissions;
}

export type ActivityType = 'Audiencia' | 'Pericia' | 'Protocolo' | 'Reuniao' | 'Prazo';

export interface Activity {
  id: string;
  time: string; // e.g. "10:00"
  type: ActivityType;
  title: string;
  clientName: string;
  clientId?: string;
  details: string; // e.g. "3ª Vara Previdenciária"
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  badge?: 'Urgente' | 'Hoje' | 'Normal';
  varaOrChannel?: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  category: 'Identificação' | 'Laudo Médico' | 'CNIS' | 'Procuração' | 'Outros';
  date: string;
  status: 'Anexado' | 'Pendente' | 'Aprovado';
  fileName?: string;
}

export interface ClientTask {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
  priority: 'Urgente' | 'Média' | 'Normal';
}

export interface ClientHistoryEvent {
  id: string;
  date: string;
  time?: string;
  author: string;
  category: 'Atendimento' | 'Ligação' | 'WhatsApp' | 'Perícia' | 'Protocolo' | 'Nota Interna';
  description: string;
}

export interface ClientProceeding {
  id: string;
  date: string;
  courtOrInss: string; // e.g. "Agência Digital INSS" | "JFSP - 3ª Vara"
  title: string;
  details: string;
  status: 'Concluído' | 'Em Andamento' | 'Pendente';
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  govPassword?: string; // Gov.: Inss.2026
  status: 'Ativo' | 'Em Atendimento' | 'Processo Ativo' | 'Aguardando Documentos' | 'Benefício Concedido' | 'Inativo';
  benefitType: string; // e.g. "BPC DEFICIENTE", "Aposentadoria por Idade"
  originIndication?: string; // e.g. "Indicação", "Instagram", "Parceiro"
  nitPis?: string;
  createdAt: string;
  notes?: string;
  documents?: ClientDocument[];
  tasks?: ClientTask[];
  history?: ClientHistoryEvent[];
  proceedings?: ClientProceeding[];
}

export interface LawCase {
  id: string;
  number: string;
  inssProtocol?: string;
  clientName: string;
  clientId?: string;
  benefitType: string;
  court: string;
  status: 'Em Exigência' | 'Aguardando Perícia' | 'Em Andamento' | 'Concedido' | 'Cumprimento de Sentença';
  urgency: 'Urgente' | 'Normal' | 'Prazo Fatal';
  deadlineDate?: string;
  lastUpdate: string;
  summary: string;
  checklist: {
    id: string;
    label: string;
    done: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'audiencia' | 'inss' | 'pericia' | 'geral';
}

export interface InssRequirement {
  id: string;
  protocolNumber: string;
  clientName: string;
  serviceName: string;
  deadlineDays: number;
  deadlineDate: string;
  status: 'Pendente' | 'Respondida' | 'Em Análise';
  requirementDetails: string;
}
