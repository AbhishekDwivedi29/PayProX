const BLACKLISTED_CARDS = new Set(["9999", "6666"]);
const BLACKLISTED_NET_USERS = new Set(["frauduser", "hacker123"]);
const BLACKLISTED_MERCHANTS = new Set(["fraud_merchant"]);
const VELOCITY_LIMIT = 3; 
const recentActivity = {};

exports.assessRisk = async (req, res) => {
  try {
    const { merchantId, amount, method, customerId, cardLast4, netbankingUsername } = req.body;

   
    if (BLACKLISTED_MERCHANTS.has(merchantId)) {
      return res.json({ status: "REJECTED", reason: "Blacklisted merchant" });
    }

    if (method === "card") {
      
      if (BLACKLISTED_CARDS.has(cardLast4)) {
    
        return res.json({ status: "REJECTED", reason: "Blacklisted card" });
      }

    if (amount > 500000) {
        return res.json({ status: "REJECTED", reason: "Card transaction amount exceeds allowed limit" });
      }

      const key = `card_${cardLast4}`;
      recentActivity[key] = (recentActivity[key] || []).filter(t => Date.now() - t < 60_000);
      recentActivity[key].push(Date.now());
      if (recentActivity[key].length > VELOCITY_LIMIT) {
        BLACKLISTED_CARDS.add(cardLast4);
        return res.json({ status: "REJECTED", reason: "Card auto-blacklisted for high velocity" });
      }
    } else if (method === "netbanking") {
     
      if (BLACKLISTED_NET_USERS.has(netbankingUsername)) {
        return res.json({ status: "REJECTED", reason: "Blacklisted netbanking user" });
      }
    
      if (amount > 1000000) {
        return res.json({ status: "REJECTED", reason: "Netbanking amount exceeds allowed limit" });
      }
    
      const key = `netbank_${netbankingUsername}`;
      recentActivity[key] = (recentActivity[key] || []).filter(t => Date.now() - t < 60_000);
      recentActivity[key].push(Date.now());
      if (recentActivity[key].length > VELOCITY_LIMIT) {

        BLACKLISTED_NET_USERS.add(netbankingUsername);
        return res.json({ status: "REJECTED", reason: "Netbanking user auto-blacklisted for high velocity" });
      }
    } else {
      return res.status(400).json({ status: "REJECTED", reason: "Unknown method" });
    }


    const custKey = `customer_${customerId}`;
    recentActivity[custKey] = (recentActivity[custKey] || []).filter(t => Date.now() - t < 60_000);
    recentActivity[custKey].push(Date.now());

    if (recentActivity[custKey].length > 5) {
      return res.json({ status: "REJECTED", reason: "Too many transactions for this customer in 1 min" });
    }

    // All checks passed
    return res.json({ status: "APPROVED" });
  } catch (err) {
    res.status(500).json({ status: "REJECTED", reason: "Risk engine error" });
  }
};
