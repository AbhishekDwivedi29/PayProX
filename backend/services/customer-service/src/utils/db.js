const mongoose = require("mongoose");

const connectDB = async () => {
mongoose.connect(process.env.MONGO_URI, { family: 4 })
.then(() => console.log(" MongoDB connected"))
.catch(err => console.error(" MongoDB connection error:", err));
};


module.exports = connectDB;
