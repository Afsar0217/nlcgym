require('dotenv').config();
const db = require('./config/db');

async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS system_cache (
          key VARCHAR(255) PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ system_cache table created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating table:", err);
    process.exit(1);
  }
}

migrate();
