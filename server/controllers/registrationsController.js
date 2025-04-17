const db = require('../db/connection');

exports.registerParticipant = (req, res) => {
  const { eventId, name, email, selected } = req.body;

  if (!eventId || !name || !email || !Array.isArray(selected) || selected.length === 0) {
    return res.status(400).json({ message: 'Missing required registration data.' });
  }

  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
    if (err || !event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (selected.length > event.max_selections) {
      return res.status(400).json({ message: 'Too many selections.' });
    }

    // Check if email already registered for this event
    db.get('SELECT * FROM registrations WHERE event_id = ? AND email = ?', [eventId, email], (err, existing) => {
      if (err) return res.status(500).json({ message: err.message });
      if (existing) return res.status(400).json({ message: 'You have already submitted your response.' });

      const placeholders = selected.map(() => '?').join(',');
      db.all(
        `SELECT * FROM options WHERE event_id = ? AND label IN (${placeholders})`,
        [eventId, ...selected],
        (err, options) => {
          if (err) return res.status(500).json({ message: err.message });

          if (options.some(o => o.count >= event.max_per_option)) {
            return res.status(400).json({ message: 'One or more options are full.' });
          }

          const updateStmt = db.prepare('UPDATE options SET count = count + 1 WHERE event_id = ? AND label = ?');
          selected.forEach(label => updateStmt.run(eventId, label));
          updateStmt.finalize();

          db.run(
            'INSERT INTO registrations (event_id, name, email, selected) VALUES (?, ?, ?, ?)',
            [eventId, name, email, selected.join(',')],
            function (err) {
              if (err) return res.status(500).json({ message: err.message });
              res.json({ message: 'Registration successful' });
            }
          );
        }
      );
    });
  });
};
