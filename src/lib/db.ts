// lib/db.ts
// SQLite database setup and utilities

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'data', 'crisis-management.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'dispatcher', 'hospital_worker', 'first_responder', 'user')),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      organization TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Activity log table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  `);

  console.log('✅ Database tables initialized');
}

// Seed sample users
export function seedSampleUsers() {
  const users = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@crisis-mgmt.local',
      phone: '555-0100',
      organization: 'Crisis Management HQ'
    },
    {
      username: 'dispatcher1',
      password: 'dispatch123',
      role: 'dispatcher',
      name: 'Sarah Johnson',
      email: 'sarah.j@dispatch.local',
      phone: '555-0101',
      organization: 'Central Dispatch'
    },
    {
      username: 'hospital1',
      password: 'hospital123',
      role: 'hospital_worker',
      name: 'Dr. Michael Chen',
      email: 'mchen@central-medical.local',
      phone: '555-0102',
      organization: 'Central Medical Center'
    },
    {
      username: 'responder1',
      password: 'respond123',
      role: 'first_responder',
      name: 'Officer James Martinez',
      email: 'jmartinez@firstresponse.local',
      phone: '555-0103',
      organization: 'Fire Department Unit Alpha'
    },
    {
      username: 'user1',
      password: 'user123',
      role: 'user',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      phone: '555-0104',
      organization: null
    }
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO users (username, password_hash, role, name, email, phone, organization)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  users.forEach(user => {
    const passwordHash = bcrypt.hashSync(user.password, 10);
    insert.run(
      user.username,
      passwordHash,
      user.role,
      user.name,
      user.email,
      user.phone,
      user.organization
    );
  });

  console.log('✅ Sample users seeded');
}

// Initialize database FIRST, before creating prepared statements
initializeDatabase();
seedSampleUsers();

// NOW create prepared statements AFTER tables exist
export const userQueries = {
  findByUsername: db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1'),
  findById: db.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1'),
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1'),
  create: db.prepare(`
    INSERT INTO users (username, password_hash, role, name, email, phone, organization)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  updateLastLogin: db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'),
  getAllByRole: db.prepare('SELECT * FROM users WHERE role = ? AND is_active = 1'),
  getAll: db.prepare('SELECT id, username, role, name, email, phone, organization, created_at, last_login FROM users WHERE is_active = 1')
};

// Session queries
export const sessionQueries = {
  create: db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'),
  findByToken: db.prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP'),
  deleteByToken: db.prepare('DELETE FROM sessions WHERE token = ?'),
  deleteExpired: db.prepare('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP'),
  deleteByUserId: db.prepare('DELETE FROM sessions WHERE user_id = ?')
};

// Activity log queries
export const activityQueries = {
  create: db.prepare('INSERT INTO activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)'),
  getByUserId: db.prepare('SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'),
  getRecent: db.prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?')
};

// Cleanup function
export function cleanupExpiredSessions() {
  const result = sessionQueries.deleteExpired.run();
  console.log(`🧹 Cleaned up ${result.changes} expired sessions`);
  return result.changes;
}

export default db;