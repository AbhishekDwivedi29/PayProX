const CustomerBankAccount = require("../models/CustomerBankAccount");
const BankAccount = require("../models/CustomerBankAccount");
const axios = require("axios");


exports.creditAccount = async (req, res) => {
  const { customer, amount, description } = req.body;

  if (!customer || !amount) return res.status(400).json({ message: "Missing fields" });

  
  const response = await axios.get(
  `${process.env.CUSTOMER_SERVICE_URL}/internal/customers/${customer}/exists`,
  {
    headers: {
      "x-internal-token": process.env.CUSTOMER_INTERNAL_SECRET
    } 
  });



let customerId = null;
if (response.data.exists) {
  customerId = customer;
} else {
  console.log("Customer not found");
}

  try {
    const account = await CustomerBankAccount.findOne({ customerId });

    if (!account) return res.status(404).json({ message: "Customer bank account not found" });

    account.balance += amount;
    account.lastUpdated = Date.now();
    await account.save();


    res.json({ message: "Account credited", account });
  } catch (err) {
    // console.error("Account credit error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.debitAccount = async (req, res) => {
  try {
    const { merchantAmount, customerId, description, cardMeta, netbanking } = req.body;

    if (!merchantAmount || !(cardMeta || netbanking)) {
        // console.error("Missing required fields:", { amount, cardMeta, netbanking });
        return res.status(400).json({ message: "Missing fields" });
    }
    
    // Determine lookup key (card or netbanking)
    let lookup = {};
    let debugId = null;

    if (cardMeta.cardLast4 && cardMeta.customerId) {
      // Card flow 
      lookup.customerId = cardMeta.customerId;
      debugId = `CardLast4: ${cardMeta.cardLast4}`;
    } else if (netbanking.netbankingUsername) {
      // Netbanking flow
      lookup.netbankingUsername = netbanking.netbankingUsername;
      debugId = `Netbanking: ${netbanking.netbankingUsername}`;
    } else {
      return res.status(400).json({ message: "Missing meta information" });
    }




    const account = await CustomerBankAccount.findOne(lookup);
   
    console.log(account);
    if (!account) {
      return res.status(404).json({ message: "Customer bank account not found" });
    }
    if (account.balance < merchantAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    account.balance -= merchantAmount;
    account.lastUpdated = Date.now();
    await account.save();



    res.json({
      message: "Account debited",
      status: "SUCCESS",
      accountNumber: account.accountNumber,
      newBalance: account.balance,
      metaUsed: cardMeta ? cardMeta : netbanking,
    });

  } catch (err) {
    console.error("Account debit error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.createBankAccount = async (req, res) => {
  try {
    const {
      customerId,
      accountHolderName,
      accountNumber,
      ifscCode,
      initialBalance
    } = req.body;
  
  
    if (!customerId || !accountHolderName || !accountNumber || !ifscCode ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await BankAccount.findOne({ customerId });
    if (existing) {
      return res.status(409).json({ message: "Bank account already exists for this customer" });
    }

    const newAccount = await BankAccount.create({
      customerId,
      accountHolderName,
      accountNumber,
      ifscCode,
      balance: initialBalance,
      lastUpdated: new Date()
    });

    res.status(201).json({
      message: "Bank account created",
      account: newAccount
    });
  } catch (err) {
    console.error(" Bank account creation failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.updateBankAccount = async (req, res) => {
  try {

    const {
      customerId,
      accountHolderName,
      accountNumber,
      ifscCode,
    } = req.body;



    if (!customerId || !accountHolderName || !accountNumber || !ifscCode ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build dynamic update payload
    const updateFields = {};
    if (accountHolderName) updateFields.accountHolderName = accountHolderName;
    if (accountNumber) updateFields.accountNumber = accountNumber;
    if (ifscCode) updateFields.ifscCode = ifscCode;
    
    updateFields.lastUpdated = new Date();

      const updatedAccount = await BankAccount.findOneAndUpdate(
      { customerId },
      { $set: updateFields },
      { new: true }
    );


    if (!updatedAccount) {
      return res.status(404).json({ message: "Bank account not found for this customer" });
    }
    res.status(200).json({
      message: "Bank account updated successfully",
      account: updatedAccount
    });
  } catch (err) {
    // console.error(" Failed to update bank account:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.setNetbanking = async (req, res) => {
  try {
    const { customerId, username, password } = req.body;
    if (!customerId || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const acc = await CustomerBankAccount.findOneAndUpdate(
      { customerId },
      { "netbanking.username": username, "netbanking.passwordHash": passwordHash },
      { new: true }
    );
    if (!acc) return res.status(404).json({ message: "Bank account not found" });

    res.json({ message: "Netbanking credentials set successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error setting netbanking", error: err.message });
  }
};



exports.netbankingLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const acc = await CustomerBankAccount.findOne({ "netbanking.username": username });
    if (!acc || !acc.netbanking || !acc.netbanking.passwordHash) {
      return res.status(401).json({ message: "Invalid login" });
    }
    const match = await bcrypt.compare(password, acc.netbanking.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const sessionToken = jwt.sign(
      { customerId: acc.customerId, username },
      process.env.NETBANKING_SECRET || "supernetbanking",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Netbanking login successful",
      customerId: acc.customerId,
      accountHolderName: acc.accountHolderName,
      accountNumber: acc.accountNumber,
      sessionToken
    });
  } catch (err) {
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};
