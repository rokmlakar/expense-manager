const express = require('express');
const walletController = require('../controllers/walletController');
const router = express.Router();

router.post("/wallet", walletController.wallet_post);
router.get("/wallets", walletController.wallet_get);
router.put("/wallet/edit/:walletId", walletController.wallet_edit)
router.delete(
    "/wallet/delete/:walletId",
    walletController.wallet_delete
  );
router.post("/walletViewer", walletController.walletViewer_post)
router.get("/walletViewers", walletController.walletViewer_get)



module.exports = router;