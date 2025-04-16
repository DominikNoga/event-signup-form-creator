const db = require('../db/connection');

exports.createEvent = (req, res) => {
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
};

exports.getEventById = (req, res) => {
  const eventId = req.params.id;
  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
    if (err || !event) return res.status(404).json({ message: 'Event not found' });
    db.all('SELECT * FROM options WHERE event_id = ?', [eventId], (err, options) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ ...event, options });
    });
  });
};

exports.getEventRegistrations = (req, res) => {
  const eventId = req.params.id;
  db.all('SELECT * FROM registrations WHERE event_id = ?', [eventId], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
};
