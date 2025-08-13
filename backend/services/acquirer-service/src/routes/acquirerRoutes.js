const express = require("express");
const router = express.Router();
const { processPayment, BankBalance} = require("../controllers/acquirerController");

router.post("/process", processPayment);
router.get("/internal/:merchantId", BankBalance);

module.exports = router;
