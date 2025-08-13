const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Merchant = require("../models/Merchant");
const axios = require("axios");
const { register, login ,me ,order,settlementRun } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);

router.post("/orders",order);
router.get("/run", verifyToken,settlementRun);


module.exports = router;
