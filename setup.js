// setup.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setup() {
    try {
        console.log('🔧 Running schema migration...');

        const schemaPath = path.join(__dirname, 'server', 'db', 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSQL);
        console.log('✅ Schema created successfully!');

        console.log('🌱 Seeding data...');
        const seedPath = path.join(__dirname, 'server', 'db', 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSQL);
        console.log('✅ Seed data inserted successfully!');

        // Verify
        const result = await pool.query('SELECT title, like_count FROM videos');
        console.log('\n📊 Videos in database:');
        console.table(result.rows);

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        await pool.end();
    }
}

setup();