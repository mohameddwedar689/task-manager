const express = require('express');
const authController = require('../controllers/auth.controller');
const authLimiter = require('../middleware/rateLimiter');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

// Rate limiter applied before validation so abusive traffic is rejected
// as cheaply as possible, before we do any DB work.
router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);

module.exports = router;
