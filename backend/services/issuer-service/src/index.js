const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./utils/db");
const issuerRoutes = require("./routes/issuerRoutes");
const bankRoutes = require("./routes/bankRoutes");

dotenv.config();

connectDB();



const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("🧑‍💻 issuer Service Ready");
});
app.use("/api/issuer", issuerRoutes);
app.use("/api/bank", bankRoutes);


const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(` Issuer Service running on port ${PORT}`);
});









