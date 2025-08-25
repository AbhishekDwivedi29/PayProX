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

js
Customer clicks "Buy Now"
→ Merchant Service creates orderId
→ Calls /session/create on Payment Gateway
→ Returns sessionId and sessionUrl to merchant


---

#### 🧭 Step 2: Session Creation (Payment Gateway)
- The Payment Gateway creates a session object with a 10-minute expiry.
- Session metadata includes orderId, merchantId, amount, currency, and items.
- Sessions are stored in-memory and cleaned up periodically.

js
POST /session/create
→ Stores session in memory
→ Returns sessionId and expiresAt


---

#### 💳 Step 3: Payment Initiation (Customer → Payment Gateway)
- The customer initiates payment using the session.
- Payload includes method (card or netbanking), merchantId, amount, currency, and either a card token or netbanking credentials.
- The system validates the payload and extracts metadata.

js
POST /initiate
→ Validates method and credentials
→ Extracts card or netbanking metadata


---

#### 🔐 Step 4: Token Verification (Card Flow)
- If the method is card, the token is verified via the Tokenization Service.
- Metadata such as cardLast4 and cardNetwork is extracted.

js
GET /verify-token/:token
→ Returns card metadata


---

#### 🔑 Step 5: Netbanking Login Verification (Netbanking Flow)
- If the method is netbanking, credentials are verified via the Issuer Bank Service.
- A valid sessionToken is required for authentication.

js
POST /api/bank/login
→ Verifies netbanking credentials
→ Returns sessionToken


---

#### ⚠ Step 6: Risk Assessment
- The Payment Gateway sends transaction metadata to the Risk Engine.
- The Risk Engine evaluates velocity, blacklists, and amount thresholds.
- If rejected, the transaction is blocked.

js
POST /assess
→ Evaluates risk
→ Returns APPROVED or REJECTED


---

#### 🏦 Step 7: Acquirer Processing & Issuer Debit
- If approved, the Payment Gateway forwards the transaction to the Acquirer Bank Service.
- The Acquirer calculates its fee and determines the merchant’s net amount.
- It then calls the Issuer Bank to debit the customer’s account based on the payment method.
- If the Issuer confirms success, the transaction is marked as successful.

js
POST /api/acquirer/process
→ Calculates fee and merchantAmount
→ Calls Issuer /bank/debit with cardMeta or netbanking
→ Returns status: SUCCESS or DECLINED


---

#### 🗃 Step 8: Transaction Persistence
- The transaction is saved to the database with full metadata.
- Includes method-specific fields like cardLast4, cardNetwork, or netbankingUsername.

js
Transaction.create({...})
→ Stores transaction record
→ Returns final status to customer

