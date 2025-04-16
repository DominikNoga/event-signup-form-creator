const express = require('express');
const router = express.Router();
const { registerParticipant } = require('../controllers/registrationsController');

router.post('/', registerParticipant);

module.exports = router;
