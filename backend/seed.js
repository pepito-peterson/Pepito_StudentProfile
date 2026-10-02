const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
    // Note: Change 'admin!' if your MySQL root password is different
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'admin!',
        database: 'student_profile_db'
    });

    // We are setting your default login password to 'password123'
    const hash = await bcrypt.hash('password123', 10);

    try {
        await pool.query(
            'INSERT IGNORE INTO students (student_id, email, password_hash, full_name, course, year_level) VALUES (?, ?, ?, ?, ?, ?)',
            ['20190018209', '20190018209@my.xu.edu.ph', hash, 'Peterson C. Pepito', 'BS Information Technology', '3rd Year']
        );
        console.log("Success: Peterson C. Pepito (20190018209) added to the database.");
    } catch (err) {
        console.error("Error inserting user:", err);
    }

    process.exit(0);
}

seed();