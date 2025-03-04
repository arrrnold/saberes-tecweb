import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
// Increase payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'car_voting'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes

// Get all cars
app.get('/api/cars', (_req, res) => {
    connection.query('SELECT * FROM cars', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add a new car
app.post('/api/cars', (req, res) => {
    const { name, image } = req.body;
    connection.query('INSERT INTO cars (name, image) VALUES (?, ?)', [name, image], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: result.insertId, name, image });
    });
});

// Get all cars with their votes
app.get('/api/cars/votes-for-cars', (_req, res) => {
    const query = `
        SELECT c.*, COUNT(v.car_id) as total_votes 
        FROM cars c 
        LEFT JOIN votes v ON c.id = v.car_id 
        GROUP BY c.id
    `;

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


// Get votes for a car
app.get('/api/cars/:id/votes', (req, res) => {
    const carId = req.params.id;
    connection.query('SELECT SUM(vote_count) as total FROM votes WHERE car_id = ?', [carId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ total: result[0].total || 0 });
    });
});

// Add a vote
app.post('/api/cars/:id/vote', (req, res) => {
    const carId = req.params.id;
    connection.query('INSERT INTO votes (car_id) VALUES (?)', [carId], (err, _result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vote recorded' });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});