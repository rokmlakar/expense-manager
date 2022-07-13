const express = require('express');
const walletController = require('../controllers/walletController');
const router = express.Router();

router.get('/wallet', walletController.wallet_get);

exports = router;