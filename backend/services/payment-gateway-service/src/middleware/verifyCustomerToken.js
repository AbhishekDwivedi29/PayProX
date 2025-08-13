const jwt = require("jsonwebtoken");

const verifyCustomerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

   
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Customer token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.CUSTOMER_JWT_SECRET);
    req.customer = decoded; 
    next();
  } catch (err) {

    // console.error(" Invalid customer token");
    return res.status(401).json({ message: "Invalid or expired customer token" });
  }
};

module.exports = verifyCustomerToken;
