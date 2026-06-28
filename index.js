const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON data coming from forms
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// This tells Vercel to send your index.html file whenever someone visits the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 1. GET route: Fetches all projects to display on the homepage
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM python_projects ORDER BY id DESC;');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// 2. POST route: Accepts new project forms and inserts them into PostgreSQL
app.post('/api/projects', async (req, res) => {
    try {
        const { title, category, difficulty, summary, python_code } = req.body;
        
        await pool.query(
            'INSERT INTO python_projects (title, category, difficulty, summary, python_code) VALUES ($1, $2, $3, $4, $5);',
            [title, category, difficulty, summary, python_code]
        );
        
        res.status(201).send('Project added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server database error');
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});