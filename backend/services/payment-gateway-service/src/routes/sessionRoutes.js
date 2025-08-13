const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();


const sessions = {};
const SESSION_LIFETIME = 10 * 60 * 1000; 

function getSession(sessionId) {
  const session = sessions[sessionId];
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    delete sessions[sessionId];
    return null;
  }
  return session;
}

setInterval(() => {
  const now = Date.now();
  for (const sid in sessions) {
    if (sessions[sid].expiresAt < now) delete sessions[sid];
  }
}, 60 * 1000); // clean every 1 min


router.post("/create", (req, res) => {
  const { orderId, merchantId, amount, currency, items } = req.body;



  if (!orderId || !merchantId || !amount || !currency)
    return res.status(400).json({ message: "Missing fields" });

  const sessionId = uuidv4();

  sessions[sessionId] = {
    sessionId,
    orderId,
    merchantId,
    amount,
    currency,
    items: items || [],
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_LIFETIME
  };

  res.status(201).json({ sessionId, expiresAt: sessions[sessionId].expiresAt });
});



router.get("/:sessionId", (req, res) => {

  const session = getSession(req.params.sessionId);

  if (!session) {
    return res.status(410).json({ message: "Session expired or not found" });
  }
  res.json(session);
});


module.exports = router;