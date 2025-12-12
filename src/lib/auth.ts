// lib/auth.ts
// Authentication utilities and helpers

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { userQueries, sessionQueries, activityQueries } from './db';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'dispatcher' | 'hospital_worker' | 'first_responder' | 'user';
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  created_at: string;
  last_login?: string;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

// Role permissions configuration
export const ROLE_PERMISSIONS = {
  admin: {
    canAccessDashboard: true,
    canManageHospitals: true,
    canManageResponders: true,
    canManageUsers: true,
    canViewMap: true,
    canViewReports: true,
    canSendAlerts: true,
    canReviewRequests: true,
  },
  dispatcher: {
    canAccessDashboard: true,
    canManageHospitals: false,
    canManageResponders: true,
    canManageUsers: false,
    canViewMap: true,
    canViewReports: true,
    canSendAlerts: true,
    canReviewRequests: true,
  },
  hospital_worker: {
    canAccessDashboard: true,
    canManageHospitals: true,
    canManageResponders: false,
    canManageUsers: false,
    canViewMap: false,
    canViewReports: false,
    canSendAlerts: false,
    canReviewRequests: false,
  },
  first_responder: {
    canAccessDashboard: true,
    canManageHospitals: false,
    canManageResponders: false,
    canManageUsers: false,
    canViewMap: true,
    canViewReports: false,
    canSendAlerts: false,
    canReviewRequests: false,
  },
  user: {
    canAccessDashboard: true,
    canManageHospitals: false,
    canManageResponders: false,
    canManageUsers: false,
    canViewMap: false,
    canViewReports: false,
    canSendAlerts: false,
    canReviewRequests: false,
  },
};

// Generate a secure session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Hash password
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// Authenticate user
export function authenticateUser(username: string, password: string): User | null {
  const row: any = userQueries.findByUsername.get(username);
  
  if (!row) {
    return null;
  }
  
  if (!verifyPassword(password, row.password_hash)) {
    return null;
  }
  
  // Update last login
  userQueries.updateLastLogin.run(row.id);
  
  // Remove password hash from returned user
  const { password_hash, ...user } = row;
  return user as User;
}

// Create session
export function createSession(userId: number): string {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  
  sessionQueries.create.run(userId, token, expiresAt.toISOString());
  
  return token;
}

// Validate session
export function validateSession(token: string): User | null {
  if (!token) {
    return null;
  }
  
  const session: any = sessionQueries.findByToken.get(token);
  
  if (!session) {
    return null;
  }
  
  const user: any = userQueries.findById.get(session.user_id);
  
  if (!user) {
    return null;
  }
  
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

// Delete session (logout)
export function deleteSession(token: string): void {
  sessionQueries.deleteByToken.run(token);
}

// Delete all sessions for a user
export function deleteUserSessions(userId: number): void {
  sessionQueries.deleteByUserId.run(userId);
}

// Log activity
export function logActivity(
  userId: number | null,
  action: string,
  details?: string,
  ipAddress?: string
): void {
  activityQueries.create.run(userId, action, details || null, ipAddress || null);
}

// Check if user has permission
export function hasPermission(
  user: User | null,
  permission: keyof typeof ROLE_PERMISSIONS.admin
): boolean {
  if (!user) {
    return false;
  }
  
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions[permission] || false;
}

// Get user by ID
export function getUserById(id: number): User | null {
  const row: any = userQueries.findById.get(id);
  if (!row) {
    return null;
  }
  const { password_hash, ...user } = row;
  return user as User;
}

// Get all users
export function getAllUsers(): User[] {
  const rows: any[] = userQueries.getAll.all();
  return rows;
}

// Create new user
export function createUser(userData: {
  username: string;
  password: string;
  role: User['role'];
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}): number {
  const passwordHash = hashPassword(userData.password);
  const result = userQueries.create.run(
    userData.username,
    passwordHash,
    userData.role,
    userData.name,
    userData.email,
    userData.phone || null,
    userData.organization || null
  );
  return result.lastInsertRowid as number;
}