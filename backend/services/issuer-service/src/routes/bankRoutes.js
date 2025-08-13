const express = require("express");
const router = express.Router();
const internalAuth = require("../middleware/internalAuth");
const { creditAccount, debitAccount,createBankAccount,setNetbanking, netbankingLogin, updateBankAccount } = require("../controllers/bankController");

router.post("/credit", internalAuth, creditAccount);
router.post("/debit", internalAuth, debitAccount);

router.post("/create", internalAuth, createBankAccount);
router.put("/update", internalAuth, updateBankAccount);

router.post("/set-netbanking", setNetbanking);
router.post("/login", netbankingLogin);


module.exports = router;

