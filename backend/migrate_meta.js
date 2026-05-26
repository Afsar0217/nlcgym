require('dotenv').config();
const db = require('./config/db');

async function migrateMeta() {
  try {
    await db.query(`
      ALTER TABLE blogs 
      ADD COLUMN IF NOT EXISTS meta_description TEXT,
      ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
    `);
    console.log("✅ Added meta_description and meta_keywords to blogs table!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error altering table:", err);
    process.exit(1);
  }
}

migrateMeta();
