const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{family: 4});
    console.log("MongoDB connected for Settlement Engine");
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

