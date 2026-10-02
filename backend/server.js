require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({ origin: '*' }));

// CRITICAL FIX: Increase payload limit from 100kb to 50mb to allow Image saving
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Network test used by login.html
app.get('/api/ping', (req, res) => res.json({ message: "pong" }));

app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ? OR email = ?', [identifier, identifier]);
        if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, rows[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        console.log(`[AUTH] User ID ${rows[0].id} logged in.`);
        res.json({ token, message: "Success" });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token." });
        req.user = user;
        next();
    });
};

// READ: Now fetches bio, skills, and the picture from MySQL
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT student_id, full_name, email, course, year_level, about_me, skills, profile_picture FROM students WHERE id = ?',
            [req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// UPDATE: Saves the text fields (name, course, year, bio, skills) to MySQL
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { name, course, year, about, skills } = req.body;
    try {
        await pool.query(
            'UPDATE students SET full_name = ?, course = ?, year_level = ?, about_me = ?, skills = ? WHERE id = ?',
            [name, course, year, about, skills, req.user.id]
        );
        console.log(`[UPDATE] Profile updated for User ID: ${req.user.id}`);
        res.json({ message: "Profile updated successfully." });
    } catch (err) {
        console.error("[ERROR] Failed to update:", err);
        res.status(500).json({ error: "Unable to update your profile." });
    }
});

// UPDATE: Saves (or clears, when null) the profile picture in MySQL
app.put('/api/profile/picture', authenticateToken, async (req, res) => {
    const { profile_picture } = req.body;
    try {
        await pool.query(
            'UPDATE students SET profile_picture = ? WHERE id = ?',
            [profile_picture || null, req.user.id]
        );
        console.log(`[UPDATE] Picture ${profile_picture ? 'updated' : 'cleared'} for User ID: ${req.user.id}`);
        res.json({ message: "Profile picture updated successfully." });
    } catch (err) {
        console.error("[ERROR] Failed to update picture:", err);
        res.status(500).json({ error: "Unable to update your profile picture." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=== Server Active (Port ${PORT}) ===`);
    console.log(`Payload Limit: 50MB (Ready for Images)\n`);
});