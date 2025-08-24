const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const internalRoutes = require("./routes/internalRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🧑‍💻 Customer Service Ready");
});

app.use("/api/auth", authRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/internal", internalRoutes);



const PORT = process.env.PORT || 4008;
app.listen(PORT, () => {
  console.log(`🧑‍💻 Customer service running on port ${PORT}`);
});

