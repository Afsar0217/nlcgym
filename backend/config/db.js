const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const useSSL = isProduction || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSSL ? { rejectUnauthorized: false } : false
    }
  : {
      host:     process.env.DB_HOST,
      port:     parseInt(process.env.DB_PORT, 10) || 5432,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: useSSL ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
  process.exit(-1);
});

/**
 * Helper: run a query and return rows.
 * Usage: const rows = await db.query('SELECT * FROM coaches');
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
