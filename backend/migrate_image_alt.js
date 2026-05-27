require('dotenv').config();
const db = require('./config/db');

async function migrateImageAlt() {
  try {
    await db.query(`
      ALTER TABLE blogs
      ADD COLUMN IF NOT EXISTS image_alt TEXT;
    `);
    console.log("✅ Added image_alt column to blogs table!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error altering table:", err);
    process.exit(1);
  }
}

migrateImageAlt();
