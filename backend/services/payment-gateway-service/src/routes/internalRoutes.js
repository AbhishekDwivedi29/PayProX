const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const internalAuth = require("../middleware/internalAuth");
const { merchantTransaction, customerTransaction ,markSettlement,merchantTransactionForSettlement} = require("../controllers/internalController");


router.get("/transactions/by-merchant/:merchantId",merchantTransaction);
router.get("/transactions/by-customer/:customerId",customerTransaction);

router.get("/transactions/:merchantId",internalAuth,merchantTransactionForSettlement);
router.put("/transactions/:id/mark-settled", internalAuth, markSettlement);




module.exports = router;

