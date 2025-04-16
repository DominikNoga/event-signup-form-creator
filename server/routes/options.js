const express = require('express');
const router = express.Router();
const { addOptionToEvent } = require('../controllers/optionsController');

router.post('/:id/options', addOptionToEvent);

module.exports = router;
