const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./utils/db");
const runSettlement = require("./jobs/runSettlement");
const settlementRoutes = require("./routes/settlementRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => res.send("Settlement Engine Running "));

app.post("/api/run", runSettlement);
app.use("/api/settlements", settlementRoutes);

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
  console.log(`Settlement Engine running on port ${PORT}`);
});

