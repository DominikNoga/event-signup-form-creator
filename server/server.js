// --- Backend (Express + SQLite3 + CORS) ---
// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite DB setup
const dbPath = path.resolve(__dirname, 'conference.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Error opening database:', err.message);
  console.log('Connected to the SQLite database.');
});

// Initialize tables
const initDb = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      max_selections INTEGER,
      max_per_option INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      label TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      FOREIGN KEY(event_id) REFERENCES events(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      name TEXT NOT NULL,
      selected TEXT NOT NULL,
      FOREIGN KEY(event_id) REFERENCES events(id)
    )`);
  });
};

initDb();

// Routes

// Create a new event
app.post('/api/events', (req, res) => {
  const { name, description, max_selections, max_per_option } = req.body;
  if (!name || !description || !max_selections || !max_per_option) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  db.run(
    `INSERT INTO events (name, description, max_selections, max_per_option) VALUES (?, ?, ?, ?)`,
    [name, description, max_selections, max_per_option],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ eventId: this.lastID });
    }
  );
});

// Get event details
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
    if (err || !event) return res.status(404).json({ message: 'Event not found' });
    db.all('SELECT * FROM options WHERE event_id = ?', [eventId], (err, options) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ ...event, options });
    });
  });
});

// Add options to event
app.post('/api/events/:id/options', (req, res) => {
  const eventId = req.params.id;
  const { label } = req.body;
  if (!label) return res.status(400).json({ message: 'Option label is required' });
  db.run(
    'INSERT INTO options (event_id, label, count) VALUES (?, ?, 0)',
    [eventId, label],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ optionId: this.lastID });
    }
  );
});

// View all registrations (for organizer)
app.get('/api/events/:id/registrations', (req, res) => {
  const eventId = req.params.id;
  db.all('SELECT * FROM registrations WHERE event_id = ?', [eventId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
