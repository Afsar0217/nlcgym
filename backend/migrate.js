require('dotenv').config();
const { query } = require('./config/db');

async function migrate() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS enquiries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          plan_type VARCHAR(255),
          message TEXT,
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Enquiries table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
