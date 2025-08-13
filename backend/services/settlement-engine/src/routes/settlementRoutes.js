
const express = require("express");
const router = express.Router();
const Settlement = require("../models/Settlement");

router.get("/:merchantId", async (req, res) => {
  try {
    const { merchantId } = req.params;
    // const { from, to } = req.query;
    // console.log("here we are fetching settlements", req.query);
    // const filter = { merchantId };

    // if (from || to) {
    //   filter.settledAt = {};
    //   if (from) filter.settledAt.$gte = new Date(from);
    //   if (to) filter.settledAt.$lte = new Date(to);
    // }

    const settlements = await Settlement.find({merchantId}).sort({ settledAt: -1 });

    res.status(200).json({ settlements });
  } catch (err) {
    // console.error("Settlement Fetch Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;


