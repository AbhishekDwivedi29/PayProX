# PayProX
A secure, scalable payment gateway ecosystem built with microservices and MongoDB Atlas.



## 🧭 Overview

The *PAYMENT-GATEWAY* project is a full-stack, production-grade simulation of a real-world digital payment ecosystem. It models the complete lifecycle of a transaction—from merchant order creation to customer payment authorization, fraud detection, settlement, and refund handling—using a modular microservices architecture.

Built with scalability, security, and recruiter-readiness in mind, this system separates concerns across dedicated services for acquirer and issuer banks, customer and merchant management, risk evaluation, tokenization, and settlement orchestration. Each service is independently deployable, internally authenticated, and professionally documented for onboarding and collaboration.

Key features include:

- 🔐 *Tokenization of card data* for secure credential handling  
- ⚠ *Real-time fraud detection* via a stateless risk engine  
- 💸 *T+2 settlement logic* for merchant payouts  
- 🧱 *Modular backend services* with internal APIs and observability  
- 🧾 *Refund workflows* with merchant-side approval and execution  
- 🛠 *Frontend and merchant dashboards* for seamless UX

Whether you're a recruiter reviewing backend craftsmanship or a developer exploring scalable payment architecture, this project demonstrates how to build secure, traceable, and maintainable systems from the ground up.


## 🏗 Architecture

The *PAYMENT-GATEWAY* system follows a modular, service-oriented architecture where each component handles a distinct phase of the transaction lifecycle. Services communicate via RESTful APIs and are secured using internal authentication headers. This design ensures scalability, traceability, and clean separation of concerns.

---

### 🔄 Transaction Lifecycle (Stepwise Flow)

#### 🧾 Step 1: Customer Clicks "Buy Now" → Order Creation (Merchant Service)
- The transaction begins when a *customer clicks "Buy Now"* on the merchant’s frontend.
- This triggers a backend call to the Merchant Service’s /orders endpoint.
- A unique orderId is generated using uuidv4.
- The order metadata includes merchantId, amount, currency, and items.
- The Merchant Service then requests a session from the Payment Gateway to begin the payment flow.



---

#### 🧭 Step 2: Session Creation (Payment Gateway)
- The Payment Gateway creates a session object with a 10-minute expiry.
- Session metadata includes orderId, merchantId, amount, currency, and items.
- Sessions are stored in-memory and cleaned up periodically.




---

#### 💳 Step 3: Payment Initiation (Customer → Payment Gateway)
- The customer initiates payment using the session.
- Payload includes method (card or netbanking), merchantId, amount, currency, and either a card token or netbanking credentials.
- The system validates the payload and extracts metadata.




---

#### 🔐 Step 4: Token Verification (Card Flow)
- If the method is card, the token is verified via the Tokenization Service.
- Metadata such as cardLast4 and cardNetwork is extracted.




---

#### 🔑 Step 5: Netbanking Login Verification (Netbanking Flow)
- If the method is netbanking, credentials are verified via the Issuer Bank Service.
- A valid sessionToken is required for authentication.




---

#### ⚠ Step 6: Risk Assessment
- The Payment Gateway sends transaction metadata to the Risk Engine.
- The Risk Engine evaluates velocity, blacklists, and amount thresholds.
- If rejected, the transaction is blocked.




---

#### 🏦 Step 7: Acquirer Processing & Issuer Debit
- If approved, the Payment Gateway forwards the transaction to the Acquirer Bank Service.
- The Acquirer calculates its fee and determines the merchant’s net amount.
- It then calls the Issuer Bank to debit the customer’s account based on the payment method.
- If the Issuer confirms success, the transaction is marked as successful.




---

#### 🗃 Step 8: Transaction Persistence
- The transaction is saved to the database with full metadata.
- Includes method-specific fields like cardLast4, cardNetwork, or netbankingUsername.



### 🔁 Refund Lifecycle (Stepwise Flow)

Refunds in the PAYMENT-GATEWAY system are initiated by customers through the *Payment Gateway Service*, reviewed by merchants, and executed via the Issuer and Acquirer Bank Services. The flow ensures traceability, merchant control, and secure fund reversal—all within a single orchestrator.

---

#### 🧾 Step 1: Customer Requests Refund via Payment Gateway
- The customer calls the Payment Gateway Service to initiate a refund for a specific transaction.
- The gateway validates the request and creates a refund record with status PENDING.
- No separate refund service is involved.



---

#### ✅ Step 2: Merchant Reviews & Approves/Rejects
- The merchant views pending refunds via their dashboard.
- They can approve or reject each request using:
  - PUT /refunds/:refundId/approve
  - PUT /refunds/:refundId/reject
- Approved refunds proceed to execution.




---

#### 💸 Step 3: Refund Execution (Issuer Credit + Acquirer Debit if Settled)
- The Payment Gateway checks if the original transaction is *settled*:
  - If *not settled*, only the Issuer Bank is called to credit the customer.
  - If *settled, the Acquirer Bank is also called to **debit the merchant*.
- Internal authentication ensures secure service-to-service communication.



---

#### 🗃 Step 4: Refund Record Persistence
- The refund transaction is logged in the database.
- Metadata includes refund ID, transaction ID, amount, method, and timestamps.
- The original transaction is updated to reflect refund status.

---

### 💰 Settlement Lifecycle (Stepwise Flow)

The Settlement Engine automates reconciliation for successful transactions, ensuring merchants receive accurate payouts. As of now, the job is *manually triggered by the merchant* and processes all eligible transactions up to the current date. Future enhancements will support automated T+2 settlement scheduling.

---

#### 🧭 Step 1: Merchant Manually Triggers Settlement Run
- The merchant initiates the settlement process by calling the /run endpoint on the Merchant Service.
- This internally invokes the Settlement Engine with the merchant’s ID.
- The job begins processing eligible transactions.




---

#### 📦 Step 2: Fetch Successful Transactions (Till-Date)
- The Settlement Engine queries the Payment Gateway for all successful transactions up to the current timestamp.
- Filters out already settled transactions.
- Although the system is designed with T+2 logic in mind, it currently settles *all till-date transactions*.




---

#### 💸 Step 3: Calculate Settlement Amount
- Aggregates total transaction value.
- Converts amount from paise to rupees.
- Prepares metadata for payout.




---

#### 🏦 Step 4: Credit Merchant Bank Account
- Sends a credit request to the Acquirer Bank Service.
- Includes merchant ID, amount, and description.
- Uses internal authentication for secure transfer.




---

#### 🗃 Step 5: Record Settlement Metadata
- Creates a settlement record in the database.
- Includes merchant ID, transaction IDs, total amount, and count.




---

#### ✅ Step 6: Mark Transactions as Settled
- Iterates through each transaction and updates its status.
- Ensures no duplicate settlements occur.

