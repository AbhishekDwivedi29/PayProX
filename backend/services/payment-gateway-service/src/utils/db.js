
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{family: 4});
    console.log("MongoDB connected for Payment Gateway");
  } catch (err) {
    // console.error(" DB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
