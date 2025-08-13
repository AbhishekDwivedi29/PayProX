const axios = require("axios");
const Settlement = require("../models/Settlement");

const runT2Settlement = async (req,res) => {
  console.log("📦 Running T+2 settlement job...");
  try {
    const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL ; 
    const t2Date = new Date(Date.now() ); // T+2 days ago 
    const merchantId =req.body.merchantId;
    const response = await axios.get(`${PAYMENT_GATEWAY_URL}/internal/transactions/${merchantId}`, {
      params: {
        status: "SUCCESS",
        beforeDate: t2Date.toISOString()
      },
      headers: {
        "x-internal-token": process.env.INTERNAL_SECRET 
      }
    });
  

   const allTxns = response.data.transactions || [];
  //  console.log(allTxns);
  //  console.log(` Found ${allTxns.length} transactions eligible for settlement.`);

    if (allTxns.length === 0) {
      // console.log(" No eligible transactions found for settlement.");
      return res.status(200).json({ message: " No eligible transactions found for settlement." });
    }

   const unsettledTxns = allTxns.filter(txn => !txn.isSettled && txn.status === "SUCCESS");

  //  console.log(unsettledTxns);

  //  for (const txn of unsettledTxns) {
  //    console.log(
  //   `📄 Processing transaction ${txn._id} - ₹${(txn.amount / 100).toFixed(2)}`
  //     );
  //   }


    // console.log(`🔗 Settling ${unsettledTxns.length} transactions`);

    const amount = unsettledTxns.reduce((sum, txn) => sum + txn.amount, 0);
    const amountInRupees = (amount / 100).toFixed(2);

    // console.log(`💰 Settlement Amount: ₹${amountInRupees}`);

    // Step 2: Process settlement per merchant
    // for (const [ txns] of Object.entries(grouped)) {
    //   console.log(`🔗 Settling ${txns.length} transactions for merchant ${merchantId}`);

    //   const amount = txns.reduce((sum, txn) => sum + txn.amount, 0);
    //   const amountInRupees = (amount / 100).toFixed(2); // Convert paise to ₹
    //   console.log(amountInRupees);
      // Fetch merchant bank info
      try {
        const bankResponse = await axios.post(
          `${process.env.ACQUIRER_SERVICE_URL}/api/bank/credit`,{ merchantId,amount,"description": `Settlement for ${unsettledTxns.length} transactions` },{
            headers: {
              "x-internal-secret": process.env.INTERNAL_SECRET
            }
          });
      //  console.log("Bank response:", bankResponse.data);
        const { accountHolderName, accountNumber, ifscCode } = bankResponse.data || {};
        
        // Save settlement record
        const settlement = await Settlement.create({
          merchantId,
          transactionIds: unsettledTxns.map(txn => txn._id),
          totalAmount:amount,
          transactionCount: unsettledTxns.length
        });

        // Mark transactions as settled
       for (const txn of unsettledTxns) {
          await axios.put(`${PAYMENT_GATEWAY_URL}/internal/transactions/${txn._id}/mark-settled`, null, {
            headers: {
              "x-internal-token": process.env.INTERNAL_SECRET || "top-secret"
            }
          });
        }

        // console.log(` Settled ₹${amountInRupees} to ${accountHolderName} - ${accountNumber} (${ifscCode})`);
      } catch (bankErr) {
        // console.error(` Failed to fetch bank info for ${merchantId}:`, bankErr.message);
      }
      return res.status(200).json({ message: `${unsettledTxns.length} transactions found for settlement.` });

  } catch (err) {
    // console.error(" Settlement Job Error:", err.message);
  }
};

module.exports = runT2Settlement;


