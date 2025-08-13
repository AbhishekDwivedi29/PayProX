const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./utils/db");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const merchantRoutes = require("./routes/merchantRoutes");
const publicRoutes = require("./routes/publicRoutes");


dotenv.config();
connectDB();

const app = express();
const allowedOrigins = process.env.FRONTEND_URLS?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Merchant Service is Live ");
});

app.use("/api/auth", authRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/merchants", publicRoutes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Merchant Service running on port ${PORT}`);

});
