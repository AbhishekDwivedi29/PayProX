const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  try {
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, password: hashedPassword });

   const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.status(200).json({
     message: "Register successful",
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        bankAccount:customer.bankAccount
      },
      token
    });
  } catch (err) {
    // console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ customerId: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

      res.status(200).json({
      message: "Login successful",
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        bankAccount:customer.bankAccount
      },
      token
    });
  } catch (err) {
    // console.error(" Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.me = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.customerId).select("-password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ customer });
  } catch (err) {
    // console.error(" Fetch /me failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.paymentdetails =async (req,res) =>{
  const sessionId =req.params.sessionId;
try{
   const axiosRes= await axios.get(`${process.env.PAYMENT_GATEWAY_URL}/session/${sessionId}`);
  //  console.log("response from the api call " , axiosRes.data);
   return res.status(201).json({
    data: axiosRes.data,
  })

}catch(err){
  return res.status(500).json(
    {message:err.response?.data?.message}
  )
}
};



exports.fetchCards = async (req, res) => {
  try {
    const customerId = req.customer?.customerId;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Missing customer ID" });
    }

    const tokenRes = await axios.get(`${ process.env.TOKENIZATION_URL}/card/${customerId}`);
    // console.log("Fetched cards from tokenization service:", tokenRes.data);

    res.status(200).json({  
      cards: tokenRes.data|| []
    });
  } catch (err) {
    // console.error("Error fetching cards:", err?.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch saved cards" });
  }
};



 exports.addCards =async (req, res) => {
  try {
    const { cardHolderName, cardNumber, expiryDate, cvv} = req.body;
    const customerId = req.customer?.customerId;
    // console.log("Received card details for adding card:", req.body);

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Missing customer ID" });
    }

    const tokenRes = await axios.post(`${process.env.TOKENIZATION_URL}/card/tokenize`, {
      cardHolderName,
      cardNumber,
      expiryDate,
      cvv,
      customerId
    });


    res.status(201).json({
      token: tokenRes.data.token,
      cardLast4: tokenRes.data.cardLast4,
      cardExpiry: tokenRes.data.cardExpiry
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to tokenize card" });
  }
};


