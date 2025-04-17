const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode } = require('../controllers/verificationController');

router.post('/request', sendVerificationCode);
router.post('/confirm', verifyCode);

module.exports = router;
