const db = require('../db/connection');

exports.registerParticipant = (req, res) => {
  const { eventId, name, selected } = req.body;

  if (!eventId || !name || !Array.isArray(selected) || selected.length === 0) {
    return res.status(400).json({ message: 'Missing required registration data.' });
  }

  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
    if (err || !event) return res.status(404).json({ message: 'Event not found' });

    if (selected.length > event.max_selections) {
      return res.status(400).json({ message: 'Too many selections.' });
    }

    const placeholders = selected.map(() => '?').join(',');
    db.all(`SELECT * FROM options WHERE event_id = ? AND label IN (${placeholders})`, [eventId, ...selected], (err, options) => {
      if (err) return res.status(500).json({ message: err.message });

      if (options.some(o => o.count >= event.max_per_option)) {
        return res.status(400).json({ message: 'One or more options are full.' });
      }

      const updateStmt = db.prepare('UPDATE options SET count = count + 1 WHERE event_id = ? AND label = ?');
      selected.forEach(label => updateStmt.run(eventId, label));
      updateStmt.finalize();

      db.run(
        'INSERT INTO registrations (event_id, name, selected) VALUES (?, ?, ?)',
        [eventId, name, selected.join(',')],
        function (err) {
          if (err) return res.status(500).json({ message: err.message });
          res.json({ message: 'Registration successful' });
        }
      );
    });
  });
};
