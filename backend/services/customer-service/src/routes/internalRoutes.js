const internalAuth = require("../middleware/internalAuth");
const Customer= require("../models/Customer");
const router = require("express").Router();

router.get("/customers/:customerId/exists", internalAuth,
  async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.customerId, 'name'); 
      if (!customer) {
        return res.json({ exists: false });
      }
      res.json({ exists: true, name: customer.name });
    } catch (err) {
      console.error("Customer lookup failed:", err.message);
      res.status(500).json({ message: "Error checking customer" });
    }
  }
);


module.exports=router;