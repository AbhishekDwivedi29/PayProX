const express = require("express");
const router = express.Router();
const Merchant = require("../models/Merchant");
const mongoose = require("mongoose");
const axios = require("axios");
const verifyMerchant = require("../middleware/verifyToken");


  

router.get("/bank-info", verifyMerchant, async (req, res) => {
  try {

    const objectId = req.merchant.merchantId;
    const merchant = await Merchant.findById(objectId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    const MerchantId = merchant.merchantId;

    const response = await axios.get(
      `${process.env.ACQUIRER_SERVICE_URL}/acquirer/internal/${MerchantId}`
    );

    res.json({ bankAmount: response.data.bankAmount });
  } catch (err) {
    // console.error(" Bank Info Fetch Error:",err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || "Server error" });
  }
});




router.put("/website", verifyMerchant, async (req, res) => {
  
 const merchantID = req.merchant.merchantId;

  try {
    const merchant = await Merchant.findById(merchantID);
    if (!merchant ) {
      return res.status(404).json({ message: "merchant not found" });
    }

    merchant.websiteDeployed = true;
    await merchant.save();

    res.status(200).json({
      message: "Website status updated  successfully",
      merchantId: merchant._id,
      websiteDeployed: merchant.websiteDeployed,
    });
  } catch (err) {
    // console.error(" Error:",err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || "Server error" });
  }
});




module.exports = router;
