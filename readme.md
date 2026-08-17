Sure. Here is the README.md without the cost section. Everything else remains the same.

# Blockchain-Based Academic Certificate Verification

A simple blockchain-based prototype for issuing, revoking, and verifying academic certificates using a Solidity smart contract on the Ethereum Virtual Machine.

## 📌 Project Overview

Academic certificate verification is often dependent on manual communication between employers and educational institutions. Fake, altered, or invalid certificates can create difficulties for employers and universities.

This project demonstrates how blockchain and smart contracts can be used to maintain a tamper-resistant certificate record.

The prototype allows:

- An authorized university to issue certificates.
- An authorized university to revoke certificates.
- Anyone to verify a certificate using its unique certificate ID.
- The system to prevent duplicate certificate IDs.
- Unauthorized accounts to be prevented from issuing or revoking certificates.

---

## 🎯 Objectives

The main objectives of this project are:

1. Store academic certificate records using a Solidity smart contract.
2. Restrict certificate issuing and revocation to the authorized university.
3. Allow public verification of certificate status.
4. Prevent duplicate certificate IDs.
5. Provide clear verification results:
   - `VERIFIED`
   - `REVOKED`
   - `NOT VERIFIED`

---

## 🏗️ Architecture

```text
                  ┌─────────────────────┐
                  │      UNIVERSITY     │
                  │   Authorized Issuer │
                  └──────────┬──────────┘
                             │
                       Issue / Revoke
                             │
                             ▼
              ┌──────────────────────────────┐
              │    SOLIDITY SMART CONTRACT   │
              │                              │
              │  Certificate Records         │
              │  Access Control              │
              │  Duplicate ID Prevention     │
              │  Issue / Revoke / Verify     │
              └──────────────┬───────────────┘
                             │
                         Blockchain
                             │
                             ▼
                  ┌─────────────────────┐
                  │       EMPLOYER      │
                  │      Verifier       │
                  └─────────────────────┘
🛠️ Technology Stack
Technology	Purpose
Solidity	Smart contract development
Ethereum	Blockchain platform
Remix IDE	Development and testing environment
Remix VM	Local blockchain environment
Solidity ^0.8.20	Contract compiler version
📂 Project Structure
CertificateVerification/
│
├── CertificateVerification.sol
└── README.md
🔐 Access Control
The contract uses an authorization mechanism to prevent unauthorized users from issuing or revoking certificates.

When the contract is deployed, the account that deploys the contract becomes the authorized university.

Therefore:

User	Issue	Revoke	Verify
Authorized University	✅	✅	✅
Employer	❌	❌	✅
Student	❌	❌	✅
Unauthorized User	❌	❌	✅
⚙️ Smart Contract Functions
The prototype has three main functions.

1. issueCertificate()
Used by the authorized university to issue a new certificate.

Inputs:

Certificate ID
Student name
Course
University name
Issue year
The function checks:

Certificate ID is not already used.
Certificate ID is not empty.
Student name is not empty.
Course is not empty.
University name is not empty.
Issue year is between 1900 and 2100.
Caller is the authorized university.
2. revokeCertificate()
Used by the authorized university to revoke an existing certificate.

The function checks:

Certificate exists.
Certificate has not already been revoked.
Caller is the authorized university.
The certificate is not deleted. Its validity status is changed to invalid.

3. verifyCertificate()
Used by anyone to check a certificate.

The function returns one of three results:

VERIFIED

The certificate exists and is currently valid.

REVOKED

The certificate was issued but has subsequently been revoked.

NOT VERIFIED

The certificate ID does not exist.

🔄 Certificate Lifecycle
             Issue Certificate
                    │
                    ▼
             ┌─────────────┐
             │   VERIFIED  │
             └──────┬──────┘
                    │
                    │ Revoke
                    ▼
             ┌─────────────┐
             │   REVOKED   │
             └─────────────┘

Unknown Certificate ID
          │
          ▼
   ┌───────────────┐
   │ NOT VERIFIED  │
   └───────────────┘
A revoked certificate cannot be restored or reused.

🧪 Testing
The prototype should be tested using the following scenarios.

Test 1 — Issue Certificate
Use the authorized university account to issue a certificate.

Expected result:

Transaction successful

Test 2 — Verify Certificate
Verify the issued certificate using its certificate ID.

Expected result:

VERIFIED

Test 3 — Unauthorized Issue
Switch to another Remix VM account and attempt to issue a certificate.

Expected result:

Transaction rejected

Reason:

Only authorized university can perform this action

Test 4 — Unauthorized Revocation
Switch to another account and attempt to revoke a certificate.

Expected result:

Transaction rejected

Reason:

Only authorized university can perform this action

Test 5 — Revoke Certificate
Switch back to the authorized university account and revoke an existing certificate.

Expected result:

Transaction successful

Test 6 — Verify Revoked Certificate
Verify the certificate after revocation.

Expected result:

REVOKED

Test 7 — Verify Unknown Certificate
Enter a certificate ID that was never issued.

Expected result:

NOT VERIFIED

Test 8 — Duplicate Certificate ID
Try to issue a certificate using an ID that has already been used.

Expected result:

Transaction rejected

Reason:

Certificate ID has already been used

🛡️ Edge Cases Covered
Edge Case	Result
Duplicate certificate ID	❌ Rejected
Reuse of revoked ID	❌ Rejected
Unauthorized issuing	❌ Rejected
Unauthorized revocation	❌ Rejected
Revoking nonexistent certificate	❌ Rejected
Revoking already revoked certificate	❌ Rejected
Empty certificate ID	❌ Rejected
Empty student name	❌ Rejected
Empty course	❌ Rejected
Empty university name	❌ Rejected
Invalid issue year	❌ Rejected
Valid certificate	✅ VERIFIED
Revoked certificate	❌ REVOKED
Unknown certificate	❌ NOT VERIFIED
Public verification	✅ Allowed
🚀 How to Run the Project
Step 1 — Open Remix
Open Remix IDE in your browser.

Step 2 — Create the Solidity File
Create:

CertificateVerification.sol

Step 3 — Add the Smart Contract
Copy the final smart contract into the file.

Step 4 — Compile
Open Solidity Compiler.

Select compiler version:

0.8.20

Click:

Compile CertificateVerification.sol

Step 5 — Deploy
Open:

Deploy & Run Transactions

Select:

Remix VM

Select:

CertificateVerification

Click:

Deploy

The account used for deployment becomes the authorized university.

Step 6 — Test the Functions
Perform the following sequence:

Issue → Verify → Unauthorized Attempt → Revoke → Verify

📊 Example Demonstration
A typical demonstration can follow this sequence:

Deploy contract.
Show university address.
Issue a certificate.
Verify the certificate.
Switch to another account.
Attempt unauthorized issuance.
Show that the transaction is rejected.
Switch back to the university account.
Revoke the certificate.
Verify the certificate again.
Show REVOKED.
This demonstrates both the functionality and the access-control mechanism.

📈 Benefits
Faster certificate verification.
Reduced dependence on manual verification.
Tamper-resistant blockchain records.
Unique certificate IDs.
Controlled certificate issuing and revocation.
Public verification.
Clear distinction between valid, revoked, and unknown certificates.
⚠️ Limitations
This project is an academic prototype and is not intended for direct production deployment.

1. Local Blockchain
The prototype uses Remix VM rather than a public blockchain network.

2. Trusted University
The system assumes that the authorized university enters truthful certificate information.

Blockchain can protect the stored record, but it cannot determine whether the original information was truthful.

3. Single Authorized Address
The prototype uses one authorized university address.

A production system could support multiple authorized university staff members and role-based permissions.

4. Key Management
The security of the authorized university account depends on protecting its private key.

5. Privacy
Student information should not simply be stored publicly on a production blockchain.

A production implementation could store a cryptographic hash or reference instead of sensitive personal information.

6. Certificate ID Format
Certificate IDs are treated as case-sensitive strings. For example:

CERT001

and

cert001

are considered different IDs.

🔮 Future Improvements
Possible future enhancements include:

Deployment to an Ethereum-compatible public testnet.
Multiple authorized university accounts.
Role-based access control.
Secure university identity management.
QR-code-based certificate verification.
Hash-based certificate storage.
Privacy-preserving certificate information.
Web or mobile frontend.
Student certificate portal.
Event logging for certificate issuance and revocation.
These features are outside the scope of the current prototype.

🎓 Project Scope
This project intentionally focuses on the core blockchain concept rather than building a complete production application.

Included
University ↓ Issue Certificate ↓ Smart Contract ↓ Blockchain Record ↓ Verify Certificate ↓ Employer

Not Included
NFT
IPFS
AI
Mobile Application
React Frontend
Database
Facial Recognition
Decentralized Identity
These technologies are not required for demonstrating the core academic certificate verification concept.

📄 Conclusion
The Blockchain-Based Academic Certificate Verification prototype demonstrates how a Solidity smart contract can provide a controlled and transparent mechanism for issuing, revoking, and verifying academic certificates.

The system ensures that only the authorized university can issue or revoke certificates, while anyone can verify certificate status using a unique certificate ID.

The prototype provides three clear verification results:

VERIFIED
REVOKED
NOT VERIFIED
This demonstrates the basic feasibility of blockchain-based academic credential verification while keeping the implementation simple and suitable for an academic capstone project.

👨‍💻 Project Information
Project: Blockchain-Based Academic Certificate Verification

Domain: Academic Credential Verification

Platform: Ethereum / Solidity

Development Environment: Remix IDE

Blockchain Environment: Remix VM

Smart Contract: CertificateVerification.sol