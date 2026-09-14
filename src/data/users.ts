import { AppUser, UserPermissions } from '../types';

export const DEFAULT_PASSWORD = 'Workday@2026';

// Nível de permissão total para a Agenda Eletrônica e Gestão de Clientes
const FULL_PERMISSIONS: UserPermissions = {
  canManageClients: true,
  canManageCases: true,
  canManageAgenda: true,
  canDeleteRecords: true,
  canSignPleadings: true,
};

export const APP_USERS: Record<string, AppUser> = {
  felipe: {
    id: 'u_felipe',
    username: 'felipe',
    name: 'Felipe',
    role: 'advogado',
    roleLabel: 'Advogado',
    email: 'fellipelemos31@gmail.com',
    title: 'Advogado Titular',
    permissions: FULL_PERMISSIONS,
  },
  estagiario: {
    id: 'u_estagiario',
    username: 'estagiario',
    name: 'Estagiário',
    role: 'estagiario',
    roleLabel: 'Estagiário',
    email: 'estagiario@workday.app',
    title: 'Estagiário',
    permissions: FULL_PERMISSIONS,
  },
  secretaria: {
    id: 'u_secretaria',
    username: 'secretaria',
    name: 'Secretária',
    role: 'secretaria',
    roleLabel: 'Secretária',
    email: 'secretaria@workday.app',
    title: 'Secretária',
    permissions: FULL_PERMISSIONS,
  },
  advogada: {
    id: 'u_advogada',
    username: 'advogada',
    name: 'Advogada',
    role: 'advogada',
    roleLabel: 'Advogada',
    email: 'advogada@workday.app',
    title: 'Advogada',
    permissions: FULL_PERMISSIONS,
  },
};
