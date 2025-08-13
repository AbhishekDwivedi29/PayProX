const express = require("express");
const router = express.Router();
const Refund = require("../models/Refund");
const verifyCustomerToken = require("../middleware/verifyCustomerToken");
const internalAuth = require("../middleware/internalAuth"); 
const { approveRefund, rejectRefund ,requestRefund ,executeRefund,customerRefund, merchantRefund} = require("../controllers/refundController");


router.get("/merchant/:merchantId",merchantRefund);
router.get("/customer/:customerId", customerRefund );


router.put("/:refundId/approve", internalAuth, approveRefund);
router.put("/:refundId/reject", internalAuth, rejectRefund);


router.post("/execute/:refundId", executeRefund);
router.post("/:transaction/request", internalAuth, requestRefund);


module.exports = router;
