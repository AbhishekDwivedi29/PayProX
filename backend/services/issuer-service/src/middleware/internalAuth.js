module.exports = (req, res, next) => {
  const token = req.header("x-internal-secret");
  if (!token || token !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ message: "Unauthorized internal access" });
  }
  next();
};

