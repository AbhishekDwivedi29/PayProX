const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const riskRoutes = require("./routes/riskRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🧑‍💻 risk Engine Ready");
});

app.use("/api/risk", riskRoutes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Risk Engine running on port ${PORT}`);
});

