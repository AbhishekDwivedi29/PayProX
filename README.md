# PayProX
A secure, scalable payment gateway ecosystem built with microservices and MongoDB Atlas.


##  Table of Contents
1.   [ Deployment](#Deployment)
2. [ Project Overview](#Overview) 
3.  [ Microservices Overview](#Microservices-Overview)  
4. [ Architecture](#Architecture)  
   - Transaction Lifecycle  
   - Refund Lifecycle  
   - Settlement Lifecycle  
5. [ Tech Stack](#Tech-Stack)  
6. [ Security Highlights](#Security-Highlights)  
7. [ Project Summary](#Project-Summary)   
8. [ Author](#Author)




##  Deployment

The *PayProX* ecosystem is deployed across cloud platforms for modular scalability and real-world simulation:

- **Frontend**: Hosted on [Vercel](https://pay-pro-x-ten.vercel.app/), providing a responsive merchant dashboard and customer interface.
- **Backend Microservices**: Deployed on Render, with each service independently hosted and secured via internal authentication.

This setup ensures seamless integration, production-grade reliability, and secure service-to-service communication.


##  Overview

The *PayProX*  is a full-stack, production-grade simulation of a real-world digital payment ecosystem. It models the complete lifecycle of a transaction from merchant order creation to customer payment authorization, fraud detection, settlement, and refund handling using a modular microservices architecture.

Built with scalability, security in mind, this system separates concerns across dedicated services for acquirer and issuer banks, customer and merchant management, risk evaluation, tokenization, and settlement orchestration. Each service is independently deployable, internally authenticated, and professionally documented for onboarding and collaboration.

Key features include:

-  *Tokenization of card data* for secure credential handling  
-  *Real-time fraud detection* via a stateless risk engine  
-  *T+2 settlement logic* for merchant payouts   
-  *Engineered PCI-DSS aligned tokenization system ensuring no raw card data is stored
-  *Refund workflows* with merchant-side approval and execution  
- *Frontend and merchant dashboards* for seamless UX

Whether you're a recruiter reviewing backend craftsmanship or a developer exploring scalable payment architecture, this project demonstrates how to build secure, traceable, and maintainable systems from the ground up.

##  Microservices-Overview

This system is composed of independently deployable microservices, each responsible for a specific domain in the payment lifecycle. Services communicate via secure REST APIs and are designed for scalability, traceability, and auditability.


##  Acquirer Bank Service 
The Acquirer Bank Service manages merchant financial operations in the payment gateway ecosystem. It processes payment requests, maintains bank accounts, and performs balance checks for transactions. 

Internal operations like crediting, debiting, and account creation are secured with authentication middleware, ensuring safe interaction with other services.

##  Customer Service 
The Customer Service is responsible for managing customer identity, payment data, and financial interactions. It provides secure endpoints for registration, login, card storage, bank account management, and refund requests. It also exposes internal APIs for service-to-service validation and orchestration.

This service ensures that customer data is protected via token-based authentication and supports seamless integration with issuer,  tokenization, and payment gateway services.

##  Issuer Bank

The Issuer Bank Service is responsible for handling customer-side financial operations, including account management and netbanking integration. It ensures secure debits and credits, supports credential-based login, and exposes internal APIs for balance checks and orchestration.

All sensitive operations are protected via internal authentication middleware to ensure secure service-to-service communication.

##  Merchant Service

The Merchant Service is responsible for handling all merchant-side operations in the payment gateway ecosystem. It enables merchants to register, authenticate, create orders, manage their bank accounts, and track financial activity such as transactions, settlements, and refunds.

This service plays a central role in the payment lifecycle by initiating orders, triggering settlement runs, and approving or rejecting refund requests. It integrates tightly with the Acquirer Bank Service to fetch  bank balances and supports secure internal communication using token-based authentication.

Merchants can also update their website deployment status, which is useful for tracking onboarding progress or enabling production-ready features. All sensitive operations are protected via verifyToken middleware to ensure secure access and traceability.


##  Payment Gateway Service

The Payment Gateway Service acts as the transaction router and orchestration layer within the PAYMENT-GATEWAY architecture. It coordinates payment initiation, session lifecycle, refund workflows, and tokenization of sensitive card data. This service is the entry point for customer-initiated payments and the backbone for merchant and bank-side transaction tracking.

It supports secure customer authentication via JWT (verifyCustomerToken) and internal service-to-service communication via internalAuth. Sessions are created and managed in-memory with expiration logic, simulating real-world payment session lifecycles. Refunds are handled through a multi-step process involving customer requests, merchant approval, and final execution.

The service also exposes internal APIs for transaction aggregation, settlement marking, and refund orchestration. Tokenization endpoints ensure that sensitive card data is never stored or transmitted in raw form, aligning with PCI-DSS principles.


##   Risk Engine 

The Risk Engine Service acts as a fraud prevention layer, analyzing transaction metadata to determine whether a payment should be approved, rejected, or flagged. It uses rule-based logic to detect anomalies based on merchant trustworthiness, payment method behavior, and customer activity velocity.

This service is invoked during the payment flow to screen transactions before they reach the issuer bank, ensuring that high-risk activity is intercepted early. It maintains in-memory activity logs and dynamically updates blacklists based on velocity thresholds.


##  Settlement Engine

The Settlement Engine Service is responsible for identifying completed transactions, calculating settlement amounts, and crediting merchant bank accounts. It operates on a T+2 model, meaning transactions are settled two days after successful completion. This service ensures financial traceability, batch processing, and accurate ledger updates across the payment ecosystem.

It communicates with the Payment Gateway to fetch eligible transactions, interacts with the Acquirer Bank Service to credit merchant accounts, and records settlement metadata for audit and reporting. All operations are protected via internal authentication headers to ensure secure service-to-service communication.At present, settlement requests can be made by merchants up to the current date.



##    Tokenization Service

The Tokenization Service is a security-focused microservice that replaces raw card data with unique, non-reversible tokens. It ensures that sensitive payment information—such as card numbers is never stored or transmitted in its original form, aligning with PCI-DSS principles and modern credential hygiene practices.

This service is invoked during payment initiation and card storage flows. It generates tokens for new cards, verifies token authenticity, and retrieves token records by customer ID. By isolating token logic into a dedicated module, the system maintains modularity, auditability, and security across all transaction flows.
  
---

##  Architecture

The *PayProX* follows a modular, service-oriented architecture where each component handles a distinct phase of the transaction lifecycle. Services communicate via RESTful APIs and are secured using internal authentication headers. This design ensures scalability, traceability, and clean separation of concerns.

---

###  Transaction Lifecycle (Stepwise Flow)

####  Step 1: Customer Clicks "Buy Now" → Order Creation (Merchant Service)
- The transaction begins when a *customer clicks "Buy Now"* on the merchant’s frontend.
- This triggers a backend call to the Merchant Service’s /orders endpoint.
- A unique orderId is generated using uuidv4.
- The order metadata includes merchantId, amount, currency, and items.
- The Merchant Service then requests a session from the Payment Gateway to begin the payment flow.



---

####  Step 2: Session Creation (Payment Gateway)
- The Payment Gateway creates a session object with a 10-minute expiry.
- Session metadata includes orderId, merchantId, amount, currency, and items.
- Sessions are stored in-memory and cleaned up periodically.




---

####  Step 3: Payment Initiation (Customer → Payment Gateway)
- The customer initiates payment using the session.
- Payload includes method (card or netbanking), merchantId, amount, currency, and either a card token or netbanking credentials.
- The system validates the payload and extracts metadata.




---

####  Step 4: Token Verification (Card Flow)
- If the method is card, the token is verified via the Tokenization Service.
- Metadata such as cardLast4 and cardNetwork is extracted.




---

####  Step 5: Netbanking Login Verification (Netbanking Flow)
- If the method is netbanking, credentials are verified via the Issuer Bank Service.
- A valid sessionToken is required for authentication.




---

####  Step 6: Risk Assessment
- The Payment Gateway sends transaction metadata to the Risk Engine.
- The Risk Engine evaluates velocity, blacklists, and amount thresholds.
- If rejected, the transaction is blocked.




---

####  Step 7: Acquirer Processing & Issuer Debit
- If approved, the Payment Gateway forwards the transaction to the Acquirer Bank Service.
- The Acquirer calculates its fee and determines the merchant’s net amount.
- It then calls the Issuer Bank to debit the customer’s account based on the payment method.
- If the Issuer confirms success, the transaction is marked as successful.




---

####  Step 8: Transaction Persistence
- The transaction is saved to the database with full metadata.
- Includes method-specific fields like cardLast4, cardNetwork, or netbankingUsername.



###  Refund Lifecycle (Stepwise Flow)

Refunds in the PayProX  are initiated by customers through the *Payment Gateway Service*, reviewed by merchants, and executed via the Issuer and Acquirer Bank Services. The system is designed so that every action is trackable, merchants have control over their operations, and money can be safely reversed

---

####  Step 1: Customer Requests Refund via Payment Gateway
- The customer calls the Payment Gateway Service to initiate a refund for a specific transaction.
- The gateway validates the request and creates a refund record with status PENDING.


---

####  Step 2: Merchant Reviews & Approves/Rejects
- The merchant views pending refunds via their dashboard.
- They can approve or reject each request using:
  - PUT /refunds/:refundId/approve
  - PUT /refunds/:refundId/reject
- Approved refunds proceed to execution.




---

####  Step 3: Refund Execution (Issuer Credit + Acquirer Debit if Settled)
- The Payment Gateway checks if the original transaction is *settled*:
  - If *not settled*, only the Issuer Bank is called to credit the customer.
  - If *settled, the Acquirer Bank is also called to **debit the merchant*.
- Internal authentication ensures secure service-to-service communication.



---

#### Step 4: Refund Record Persistence
- The refund transaction is logged in the database.
- Metadata includes refund ID, transaction ID, amount, method, and timestamps.
- The original transaction is updated to reflect refund status.


###  Settlement Lifecycle (Stepwise Flow)

The Settlement Engine automates reconciliation for successful transactions, ensuring merchants receive accurate payouts. As of now, the job is *manually triggered by the merchant* and processes all eligible transactions up to the current date. Future enhancements will support automated T+2 settlement scheduling.

---

####  Step 1: Merchant Manually Triggers Settlement Run
- The merchant initiates the settlement process by calling the /run endpoint on the Merchant Service.
- This internally invokes the Settlement Engine with the merchant’s ID.
- The job begins processing eligible transactions.




---

####  Step 2: Fetch Successful Transactions (Till-Date)
- The Settlement Engine queries the Payment Gateway for all successful transactions up to the current timestamp.
- Filters out already settled transactions.
- Although the system is designed with T+2 logic in mind, it currently settles *all till-date transactions*.




---

####  Step 3: Calculate Settlement Amount
- Aggregates total transaction value.
- Converts amount from paise to rupees.
- Prepares metadata for payout.




---

####  Step 4: Credit Merchant Bank Account
- Sends a credit request to the Acquirer Bank Service.
- Includes merchant ID, amount, and description.
- Uses internal authentication for secure transfer.




---

####  Step 5: Record Settlement Metadata
- Creates a settlement record in the database.
- Includes merchant ID, transaction IDs, total amount, and count.


---

####  Step 6: Mark Transactions as Settled
- Iterates through each transaction and updates its status.
- Ensures no duplicate settlements occur.



##  Tech-Stack

### Backend
- *Node.js + Express* – Core framework for all microservices  
- *MongoDB* – Stores transactions, settlements, refunds, and user data  
- *uuidv4* – Generates unique IDs for orders and sessions  

###  Security
- *JWT* – Authenticates customers and merchants  
- *Internal Auth Headers* – Secures service-to-service communication  
- *Tokenization Service* – Replaces raw card data with secure tokens  

###  Inter-Service Communication
- *Axios* – Handles REST API calls between services  
- *RESTful APIs* – Each service exposes isolated endpoints  



###  Config & Deployment
- *dotenv* – Manages environment variables  
- *Render* – Deploys backend services  
- *Vercel* – Hosts frontend



---

##  Security-Highlights

The PayProX enforces production-grade security across all services, ensuring safe data handling, credential hygiene, and fraud prevention.

---

###  Authentication & Access Control
- *JWT-based Auth* for customers and merchants  
- *Role Isolation* between merchant and customer flows  
- *Internal Auth Headers* (token, secret) for secure service-to-service communication

---

###  Credential Hygiene
- *Tokenization Service* replaces raw card data with secure, non-reversible tokens  
- *Card Metadata Isolation* stores only cardLast4 and cardExpiry ,never full card numbers  
- *No Raw Card Storage* anywhere in the system

---

### Fraud Detection
- *Risk Engine* evaluates velocity, blacklist status, and transaction thresholds  
- *Auto-Blocking* of suspicious transactions before issuer/acquirer involvement  


---

###  Refund & Settlement Safety
- *Refund Execution Logic* checks if the original transaction is settled  
- *Merchant Debit* via Acquirer Bank only if transaction is settled  
- *Secure Issuer Credit* to customer account with internal authentication  
- *Settlement Isolation* ensures only successful, un-settled transactions are processed

##  Project-Summary

This PayProX is a microservice-based backend architecture designed for secure, scalable, and traceable transaction processing. It handles the full lifecycle of payments—from order creation and session management to risk assessment, fund movement, refunds, and settlements.

Built with production-grade practices, it enforces credential hygiene, fraud prevention, and service isolation. Each service is independently deployable and communicates via secure REST APIs, making the system cloud-ready and audit-friendly.


---

##   Author

*Abhishek Dwivedi*  

Software Engineer focused on building secure, scalable systems with clean architecture and real-time capabilities. Skilled in backend development, REST APIs, microservices, and frontend integration.
Tech Stack: Node.js, Express.js, MongoDB, React.js, Zustand, Tailwind CSS
 Tools: Git, GitHub, VSCode, Postman

 



> Connect  on [LinkedIn](https://www.linkedin.com/in/abhishek-d-5a217425b?trk=public_profile_browsemap&originalSubdomain=in) or explore more on [GitHub](https://github.com/AbhishekDwivedi29).
