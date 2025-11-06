import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dataDir = path.join(process.cwd(), 'data');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    initializeTables(db);
  }
  
  return db;
}

function initializeTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      block_type TEXT NOT NULL,
      block_order INTEGER NOT NULL,
      content TEXT NOT NULL,
      styles TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS page_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      page TEXT NOT NULL,
      user_agent TEXT,
      referrer TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_blocks_order ON blocks(block_order);
    CREATE INDEX IF NOT EXISTS idx_page_visits_timestamp ON page_visits(timestamp);
    CREATE INDEX IF NOT EXISTS idx_page_visits_session ON page_visits(session_id);
  `);
}

export interface AdminUser {
  id?: number;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export interface Block {
  id?: number;
  block_type: string;
  block_order: number;
  content: string;
  styles: string;
  created_at?: string;
  updated_at?: string;
}

export interface PageVisit {
  id?: number;
  session_id: string;
  page: string;
  user_agent?: string;
  referrer?: string;
  ip_address?: string;
  timestamp?: string;
}

export const adminUserQueries = {
  findByEmail: (email: string): AdminUser | undefined => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as AdminUser | undefined;
  },

  findFirst: (): AdminUser | undefined => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM admin_users LIMIT 1').get() as AdminUser | undefined;
  },

  create: (email: string, password: string): void => {
    const db = getDatabase();
    db.prepare('INSERT INTO admin_users (email, password) VALUES (?, ?)').run(email, password);
  },

  deleteAll: (): void => {
    const db = getDatabase();
    db.prepare('DELETE FROM admin_users').run();
  },
};

export const blockQueries = {
  getAll: (): Block[] => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM blocks ORDER BY block_order ASC').all() as Block[];
  },

  getById: (id: number): Block | undefined => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM blocks WHERE id = ?').get(id) as Block | undefined;
  },

  create: (blockType: string, blockOrder: number, content: string, styles: string): number => {
    const db = getDatabase();
    const result = db.prepare('INSERT INTO blocks (block_type, block_order, content, styles) VALUES (?, ?, ?, ?)')
      .run(blockType, blockOrder, content, styles);
    return result.lastInsertRowid as number;
  },

  update: (id: number, content: string, styles: string): void => {
    const db = getDatabase();
    db.prepare('UPDATE blocks SET content = ?, styles = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(content, styles, id);
  },

  updateOrder: (id: number, newOrder: number): void => {
    const db = getDatabase();
    db.prepare('UPDATE blocks SET block_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newOrder, id);
  },

  delete: (id: number): void => {
    const db = getDatabase();
    db.prepare('DELETE FROM blocks WHERE id = ?').run(id);
  },

  reorderAll: (blocks: Array<{ id: number; block_order: number }>): void => {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE blocks SET block_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    
    const transaction = db.transaction((items: Array<{ id: number; block_order: number }>) => {
      for (const item of items) {
        stmt.run(item.block_order, item.id);
      }
    });
    
    transaction(blocks);
  },
};

export const visitQueries = {
  create: (sessionId: string, page: string, userAgent?: string, referrer?: string, ipAddress?: string): void => {
    const db = getDatabase();
    db.prepare('INSERT INTO page_visits (session_id, page, user_agent, referrer, ip_address) VALUES (?, ?, ?, ?, ?)')
      .run(sessionId, page, userAgent || null, referrer || null, ipAddress || null);
  },

  countLast30Days: (): number => {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT COUNT(*) as count 
      FROM page_visits 
      WHERE timestamp >= datetime('now', '-30 days')
    `).get() as { count: number };
    return result.count;
  },

  countToday: (): number => {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT COUNT(*) as count 
      FROM page_visits 
      WHERE DATE(timestamp) = DATE('now')
    `).get() as { count: number };
    return result.count;
  },

  uniqueVisitorsLast30Days: (): number => {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as count 
      FROM page_visits 
      WHERE timestamp >= datetime('now', '-30 days')
    `).get() as { count: number };
    return result.count;
  },

  dailyViewsLast7Days: (): Array<{ date: string; views: number }> => {
    const db = getDatabase();
    return db.prepare(`
      SELECT DATE(timestamp) as date, COUNT(*) as views
      FROM page_visits
      WHERE timestamp >= datetime('now', '-7 days')
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `).all() as Array<{ date: string; views: number }>;
  },

  topPages: (): Array<{ page: string; views: number }> => {
    const db = getDatabase();
    return db.prepare(`
      SELECT page, COUNT(*) as views
      FROM page_visits
      WHERE timestamp >= datetime('now', '-30 days')
      GROUP BY page
      ORDER BY views DESC
      LIMIT 10
    `).all() as Array<{ page: string; views: number }>;
  },

  allLast30Days: (): PageVisit[] => {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM page_visits 
      WHERE timestamp >= datetime('now', '-30 days')
    `).all() as PageVisit[];
  },
};
