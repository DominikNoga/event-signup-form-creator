const express = require('express');
const router = express.Router();
const { createEvent, getEventById, getEventRegistrations } = require('../controllers/eventsController');
const { addOptionToEvent } = require('../controllers/optionsController');

router.post('/', createEvent);
router.get('/:id', getEventById);
router.get('/:id/registrations', getEventRegistrations);
router.post('/:id/options', addOptionToEvent)

module.exports = router;
