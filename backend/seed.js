// Load DB credentials from backend/.env (same file server.js uses), so no password is written here
require('dotenv').config({ path: __dirname + '/.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Test accounts for logging into the app (use student_id OR email + password)
// Running this file again is safe: accounts that already exist are skipped.
const accounts = [
    {
        student_id: '20190018209',
        email: '20190018209@my.xu.edu.ph',
        password: 'password123',
        full_name: 'Peterson C. Pepito',
        course: 'BS Information Technology',
        year_level: '3rd Year'
    },
    //Second test account
    {
        student_id: '20240002',
        email: 'test2@my.xu.edu.ph',
        password: 'TestStudent2026',
        full_name: 'Juan Dela Cruz',
        course: 'BS Computer Science',
        year_level: '2nd Year'
    }
];

async function seed() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    for (const acc of accounts) {
        const hash = await bcrypt.hash(acc.password, 10);
        try {
            const [result] = await pool.query(
                'INSERT IGNORE INTO students (student_id, email, password_hash, full_name, course, year_level) VALUES (?, ?, ?, ?, ?, ?)',
                [acc.student_id, acc.email, hash, acc.full_name, acc.course, acc.year_level]
            );
            if (result.affectedRows === 1) {
                console.log(`Success: ${acc.full_name} (${acc.student_id}) added to the database.`);
            } else {
                console.log(`Skipped: ${acc.full_name} (${acc.student_id}) already exists.`);
            }
        } catch (err) {
            console.error(`Error inserting ${acc.student_id}:`, err);
        }
    }

    process.exit(0);
}

seed();
