const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../conference.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('DB Error:', err.message);
  else console.log('Connected to SQLite DB');
});

module.exports = db;
