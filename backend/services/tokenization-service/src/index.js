
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./utils/db");
const tokenRoutes = require("./routes/tokenRoutes");



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tokenization Service is Live 🔐");
});
app.use("/api/card", tokenRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Tokenization Service running on port ${PORT}`);
});