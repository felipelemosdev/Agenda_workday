/**
 * Workday - Serviço de Auditoria do Sistema
 * 
 * Este serviço gerencia o registro e consulta de logs de auditoria no Workday.
 * Atualmente persiste em localStorage, projetado com modelo de dados compatível
 * para migração futura direta para PostgreSQL / Supabase.
 *
 * ESQUEMA SUPABASE / POSTGRESQL PREVISTO:
 * --------------------------------------------------------------------------
 * CREATE TABLE audit_logs (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id TEXT NOT NULL,
 *   user_name TEXT NOT NULL,
 *   user_role TEXT NOT NULL,
 *   action TEXT NOT NULL,
 *   entity TEXT NOT NULL,
 *   entity_id TEXT,
 *   entity_name TEXT,
 *   description TEXT NOT NULL,
 *   old_value JSONB,
 *   new_value JSONB,
 *   metadata JSONB,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
 * CREATE INDEX idx_audit_logs_action ON audit_logs(action);
 * CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
 * CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
 * --------------------------------------------------------------------------
 */

import { AuditLog, AuditAction, AuditEntity } from '../types';

const AUDIT_STORAGE_KEY = 'workday_audit_logs';

/**
 * Logs iniciais demonstrativos baseados nos exemplos solicitados
 */
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    userId: 'u_felipe',
    userName: 'Felipe Lemos',
    userRole: 'advogado',
    action: 'LOGIN',
    entity: 'SYSTEM',
    description: 'Felipe Lemos realizou login no sistema.',
    timestamp: '2026-09-14T07:30:12.000Z',
    metadata: { ip: '189.26.110.42', userAgent: 'Chrome/128 MacOS' },
  },
  {
    id: 'log_002',
    userId: 'u_felipe',
    userName: 'Felipe Lemos',
    userRole: 'advogado',
    action: 'CREATE',
    entity: 'CLIENT',
    entityId: 'c_joao_silva',
    entityName: 'João da Silva',
    description: 'Felipe Lemos cadastrou o cliente João da Silva.',
    timestamp: '2026-09-14T07:45:00.000Z',
    metadata: { benefitType: 'BPC/LOAS', channel: 'Presencial' },
  },
  {
    id: 'log_003',
    userId: 'u_felipe',
    userName: 'Felipe Lemos',
    userRole: 'advogado',
    action: 'STATUS_CHANGE',
    entity: 'CLIENT',
    entityId: 'c_joao_silva',
    entityName: 'João da Silva',
    description: "Felipe Lemos alterou o status do cliente João da Silva de 'Aguardando Documentos' para 'Processo Ativo'.",
    oldValue: 'Aguardando Documentos',
    newValue: 'Processo Ativo',
    timestamp: '2026-09-14T08:05:22.000Z',
    metadata: { field: 'status' },
  },
  {
    id: 'log_004',
    userId: 'u_ana_carolina',
    userName: 'Ana Carolina',
    userRole: 'advogada',
    action: 'CREATE',
    entity: 'PROCEEDING',
    entityId: 'proc_0001234',
    entityName: 'Andamento processual',
    description: 'Ana Carolina adicionou um andamento ao processo 0001234-56.2026.8.19.0001.',
    timestamp: '2026-09-14T08:14:40.000Z',
    metadata: { caseNumber: '0001234-56.2026.8.19.0001', court: 'TRF2 - 1ª Vara Previdenciária' },
  },
  {
    id: 'log_005',
    userId: 'u_isabelle',
    userName: 'Isabelle Nascimento',
    userRole: 'secretaria',
    action: 'CREATE',
    entity: 'TASK',
    entityId: 'task_cadunico',
    entityName: 'Nova tarefa',
    description: 'Isabelle Nascimento criou uma nova tarefa.',
    timestamp: '2026-09-14T08:20:15.000Z',
    metadata: { taskTitle: 'Cobrar folha resumo do CadÚnico da cliente Maria', priority: 'Urgente' },
  },
  {
    id: 'log_006',
    userId: 'u_felipe',
    userName: 'Felipe Lemos',
    userRole: 'advogado',
    action: 'DELETE',
    entity: 'DOCUMENT',
    entityId: 'doc_old_391',
    entityName: 'Comprovante_antigo.pdf',
    description: 'Felipe Lemos excluiu um documento.',
    oldValue: 'Comprovante_antigo.pdf (substituído por versão autenticada)',
    timestamp: '2026-09-14T08:26:02.000Z',
    metadata: { clientId: 'c_adriana', reason: 'Documento duplicado' },
  },
];

/**
 * Recupera todos os logs de auditoria armazenados localmente
 */
export function getStoredAuditLogs(): AuditLog[] {
  try {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Erro ao ler logs de auditoria:', error);
  }
  return INITIAL_AUDIT_LOGS;
}

/**
 * Salva a lista de logs de auditoria no armazenamento local
 */
export function saveAuditLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Erro ao salvar logs de auditoria:', error);
  }
}

/**
 * Registra um novo evento de auditoria no sistema
 */
export function createAuditLog(entry: {
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
  metadata?: Record<string, any>;
  timestamp?: string;
}): AuditLog {
  const newLog: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: entry.userId,
    userName: entry.userName,
    userRole: entry.userRole,
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId,
    entityName: entry.entityName,
    description: entry.description,
    oldValue: entry.oldValue,
    newValue: entry.newValue,
    metadata: entry.metadata,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  const currentLogs = getStoredAuditLogs();
  const updatedLogs = [newLog, ...currentLogs];
  saveAuditLogs(updatedLogs);

  return newLog;
}

/**
 * Exporta os logs para formato CSV compatível com Excel e Google Sheets
 */
export function exportAuditLogsCSV(logs: AuditLog[]): void {
  const headers = [
    'ID',
    'Data e Hora (ISO)',
    'Usuário',
    'Cargo',
    'Ação',
    'Módulo / Entidade',
    'ID Registro',
    'Nome Registro',
    'Descrição',
    'Valor Anterior',
    'Novo Valor',
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = logs.map((log) => [
    escapeCSV(log.id),
    escapeCSV(log.timestamp),
    escapeCSV(log.userName),
    escapeCSV(log.userRole),
    escapeCSV(log.action),
    escapeCSV(log.entity),
    escapeCSV(log.entityId || ''),
    escapeCSV(log.entityName || ''),
    escapeCSV(log.description),
    escapeCSV(log.oldValue || ''),
    escapeCSV(log.newValue || ''),
  ]);

  const csvContent =
    '\uFEFF' +
    [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `workday_auditoria_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta os logs para formato JSON completo
 */
export function exportAuditLogsJSON(logs: AuditLog[]): void {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(logs, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute(
    'download',
    `workday_auditoria_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
