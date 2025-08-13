const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { register, login ,me ,paymentdetails , fetchCards, addCards} = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken ,me);

router.get("/payment/:sessionId",verifyToken,paymentdetails);

router.get("/card", verifyToken , fetchCards);
router.post("/card", verifyToken , addCards);




module.exports = router;
