const db = require('../db/connection');

exports.addOptionToEvent = (req, res) => {
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
};
