const express = require("express");
const router = express.Router();
const { authorizePayment ,BankBalance } = require("../controllers/issuerController");



router.post("/authorize", authorizePayment);
router.get("/internal/:customerId", BankBalance);


module.exports = router;

