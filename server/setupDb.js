import fs from 'fs';
import pool from './db.js';

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');

    // Read and execute schema.sql
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(schema);

    console.log('Database schema created successfully!');
    console.log('Tables created: users, notes');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
