const db = require('./config/db');

async function checkBlogs() {
  try {
    const { rows } = await db.query('SELECT id, title, slug, is_published FROM blogs');
    console.log('Blogs in DB:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error querying DB:', err);
    process.exit(1);
  }
}

checkBlogs();
