const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./utils/db");


dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const acquirerRoutes = require("./routes/acquirerRoutes");
const bankRoutes= require("./routes/bankRoutes");

app.use("/api/acquirer", acquirerRoutes);

app.use("/api/bank", bankRoutes);

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`🏦 Acquirer Service running on port ${PORT}`);
});
 


















