const express = require('express');
const router = express.Router();
const { createEvent, getEventById, getEventRegistrations } = require('../controllers/eventsController');

router.post('/', createEvent);
router.get('/:id', getEventById);
router.get('/:id/registrations', getEventRegistrations);

module.exports = router;
