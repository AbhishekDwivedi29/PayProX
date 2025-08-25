const express = require("express");
const router = express.Router();

const { tokenizeCard, verifyToken , getTokensByCustomerId } = require("../controllers/tokenController");
const verifyCustomerToken = require("../middleware/verifyCustomer");

router.post("/tokenize",  tokenizeCard);
router.get("/verify-token/:token", verifyToken);

router.get("/:customerId", getTokensByCustomerId);


module.exports = router;
