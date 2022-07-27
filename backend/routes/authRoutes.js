const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/user', authController.auth_user);
router.post('/auth', authController.auth_login);
router.post('/logout', authController.auth_logout);
router.post('/register', authController.auth_register);
router.get('/verify-email', authController.auth_verify)

module.exports = router;