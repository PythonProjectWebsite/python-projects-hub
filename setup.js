const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

async function createTable() {
    try {
        // 1. Create the table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS python_projects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                difficulty VARCHAR(50),
                summary TEXT,
                python_code TEXT
            );
        `);
        console.log("✅ Table 'python_projects' created successfully!");

        // 2. Insert your first project row
        await pool.query(`
            INSERT INTO python_projects (title, category, difficulty, summary, python_code) 
            VALUES (
                'Build a Web Scraper using Python',
                'Automation',
                'Easy',
                'In this guide, you will learn how to extract data from websites using Python and the BeautifulSoup library.',
                'import requests\nfrom bs4 import BeautifulSoup\n\nurl = "https://example.com"\nresponse = requests.get(url)\nsoup = BeautifulSoup(response.text, "html.parser")\nprint(soup.title.text)'
            ) ON CONFLICT DO NOTHING;
        `);
        console.log("🚀 First Python project successfully inserted into database!");

    } catch (err) {
        console.error("❌ Error setting up database:", err);
    } finally {
        await pool.end();
    }
}

createTable();