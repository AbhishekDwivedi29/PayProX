module.exports = (req, res, next) => {
  const internalToken = req.header("x-internal-token");

  if (!internalToken || internalToken !== process.env.INTERNAL_SECRET) {
   
    return res.status(401).json({ message: "Unauthorized internal access" });
  }

  next();
};
