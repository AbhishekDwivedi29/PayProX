const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./utils/db");
const paymentRoutes = require("./routes/paymentRoutes");
const internalRoutes = require("./routes/internalRoutes");
const refundRoutes = require("./routes/refundRoutes");
const sessionRoutes = require("./routes/sessionRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Payment Gateway Service is Live ⚙️");
});

app.use("/api/payments", paymentRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/session", sessionRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(` Payment Gateway running on port ${PORT}`);
});

