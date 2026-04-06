const db = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    const migrationFile = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await db.query(sql);
    
    console.log('✓ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
