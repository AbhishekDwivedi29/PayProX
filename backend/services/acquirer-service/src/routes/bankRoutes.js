const express = require("express");
const router = express.Router();
const internalAuth = require("../middleware/internalAuth");
const { creditAccount, debitAccount ,createBankAccount, updateBankAccount} = require("../controllers/bankController");


router.post("/credit", internalAuth, creditAccount);
router.post("/debit", internalAuth, debitAccount);
router.post("/create", internalAuth, createBankAccount);
router.put("/update", internalAuth, updateBankAccount);

module.exports = router;

