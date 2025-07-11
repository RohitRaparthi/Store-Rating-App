const express = require('express');
const router = express.Router();
const { register, login, updatePassword} = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/update-password', authenticate, updatePassword);

module.exports = router;
