const express = require('express');
const walletController = require('../controllers/walletController');
const router = express.Router();

router.post("/wallet", walletController.wallet_post);
router.get("/wallets", walletController.wallet_get);



module.exports = router;