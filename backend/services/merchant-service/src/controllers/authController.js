const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Merchant = require("../models/Merchant");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  try {
   
    const { businessName, ownerName, email, contactNumber, password , merchantId} = req.body;

    const existingEmail = await Merchant.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Merchant with this email ID already exists" });

    const existingMerchantId = await Merchant.findOne({ merchantId });
    if (existingMerchantId) return res.status(400).json({ message: "Merchant with this merchant ID already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMerchant = await Merchant.create({
      businessName,
      ownerName,
      email,
      contactNumber,
      password: hashedPassword,
      merchantId,
      kycStatus: "VERIFIED" 
    });

    const token = jwt.sign(
      { merchantId: newMerchant._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(201).json({
      message: "Merchant registered successfully",
      merchant: {
        id: newMerchant._id,
        businessName: newMerchant.businessName,
        ownerName: newMerchant.ownerName,
        contactNumber: newMerchant.contactNumber,
        email: newMerchant.email,
        kycStatus: newMerchant.kycStatus,
        merchantId: newMerchant.merchantId,
        websiteDeployed: newMerchant.websiteDeployed || false
      },
      token
    });
  } catch (err) {
    // console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const login = async (req, res) => {
  try {
      
    const { email, password } = req.body;

    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { merchantId: merchant._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      message: "Login successful",
      merchant: {
        id: merchant._id,
        businessName: merchant.businessName,
        ownerName: merchant.ownerName,
        contactNumber: merchant.contactNumber,
        email: merchant.email,
        kycStatus: merchant.kycStatus,
        merchantId: merchant.merchantId,
        websiteDeployed: merchant.websiteDeployed || false, 
        bankAccount: merchant.bankAccount || null 
      },
      token
    });
  } catch (err) {
    // console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const me = async (req, res) => {
  try {

    const merchant = await Merchant.findById(req.merchant.merchantId).select("-password");
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    res.status(200).json({ merchant });
  } catch (err) {
    // console.error("Get Me Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const order =  async (req, res) => { 
  const orders = {};
  try {
    const { merchantId, amount, currency = "INR", items } = req.body;
  

    const orderId = uuidv4();
    orders[orderId] = {
      orderId, merchantId, amount, currency, items, status: "CREATED"
    };

    const sessionRes = await axios.post(
      `${process.env.PAYMENT_GATEWAY_URL}/session/create`,
      { orderId, merchantId, amount, currency, items }
    );

  //  console.log(`${process.env.Merchant_URL}/customer/pay?sessionId=${sessionRes.data.sessionId}`);
    res.json({
      orderId,
      expiresAt: sessionRes.data.expiresAt ,
      sessionUrl: `${process.env.Merchant_URL}/customer/pay?sessionId=${sessionRes.data.sessionId}`
    });
  } catch (err) {
    console.error("Order create error:", err.message);
    res.status(500).json({ message: "Failed to create order" });
  }
};


const settlementRun = async (req, res) => {
try{

  const merchantId=req.merchant.merchantId

 const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId; 

  

     const response = await axios.post(
      `${process.env.Settlement_Engine_URL}/run`,
         { merchantId: readableMerchantId }
         );

    return res.status(200).json({ message: "Settlement job triggered", settlements: response.data || [] });
  
    }catch (err) {
    // console.error("settlement error:", err?.response?.data || err.message);
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || "Server error" });
    }};



module.exports = {
  register,
  login,
  me,
  order,
  settlementRun
};





