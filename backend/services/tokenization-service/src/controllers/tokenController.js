const CardToken = require("../models/CardToken");
const crypto = require("crypto");

const tokenizeCard = async (req, res) => {
  try {
    const { cardHolderName, cardNumber, expiryDate, cardNetwork, customerId } = req.body;
    // console.log("Tokenization Request:", req.body);
    // // const customerId = req.customer.customerId;

    if (!cardNumber || cardNumber.length < 12)
      return res.status(400).json({ message: "Invalid card number" });

    const cardLast4 = cardNumber.slice(-4);
    const token = crypto.randomUUID(); // or use SHA hash

    const newToken = await CardToken.create({
      customerId,
      cardHolderName,
      cardLast4,
      expiryDate,
      cardNetwork,
      token
    });

    res.status(201).json({
      message: "Card tokenized successfully",
      
      token: newToken.token,
      cardLast4: newToken.cardLast4,
      cardExpiry: newToken.expiryDate
    });
  } catch (err) {
    // console.error("Tokenization Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.params.token;
    const cardData = await CardToken.findOne({ token });

    if (!cardData) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.status(200).json({
      token: cardData.token,
      cardLast4: cardData.cardLast4,
      cardExpiry: cardData.cardExpiry,
      cardNetwork: cardData.cardNetwork,
      customerId: cardData.customerId
    });
  } catch (err) {
    // console.error("Token Lookup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getTokensByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const tokens = await CardToken.find({ customerId });
    // console.log("Tokens found for customer:", tokens);

    // if (tokens.length === 0) {
    //   return res.status(404).json({ message: "No tokens found for this customer" });
    // }

    res.status(200).json({
      message: "Tokens retrieved successfully",
      count: tokens.length,
      cards: tokens.map(card => ({
        token: card.token,
        cardLast4: card.cardLast4,
        cardExpiry: card.expiryDate,
        cardNetwork: card.cardNetwork
      }))
    });

  } catch (err) {
    // console.error("Token retrieval error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  tokenizeCard,
  verifyToken,
  getTokensByCustomerId 
};




