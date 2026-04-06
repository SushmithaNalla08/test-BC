Project Name
Olympianz
Tagline (from footer & various pages): Secure. Transparent. Yours.
Core Concept & Purpose
Olympianz is a blockchain-based academic credentialing system designed to issue, store, verify, and manage certificates (diplomas, course completions, achievements etc.) in a tamper-proof, transparent, and decentralized way.
It aims to solve common problems with traditional certificates:

Easy forgery / alteration
Difficult verification for employers / institutions
Centralized storage → single point of failure / privacy risks
Slow / manual verification processes

Instead, it uses Ethereum smart contracts + IPFS (via Pinata) to make credentials:

Immutable once issued
Instantly verifiable by anyone
Owned/controlled by the student (via wallet)
Linked to real PDF documents

Target Users & Main Roles






























RolePageMain CapabilitiesAdministratoradmin.htmlIssue new certificates (upload PDF → hash → IPFS → mint on-chain), revoke certificates, verify any certStudentstudent.htmlConnect wallet, view all their issued certificates, see details + IPFS PDF link, copy shareable verification linkVerifierverify.htmlAnyone can verify a certificate by: 
• entering Certificate ID
• uploading the original PDF (hash comparison)General visitorindex.html, about.html, faqs.html, community.html, resources.htmlLearn about the project, read FAQs, see community/newsletter, download resources (whitepaper, SDK, etc.)
Technology Stack (Frontend + Blockchain)

Frontend:
Pure HTML5 + CSS3 + vanilla JavaScript (no React/Vue/Svelte)
Tailwind CSS (via CDN)
Custom retro-futuristic styling (style.css): gradients, glassmorphism-like cards, glowing effects, neon text
Web3.js library (v1.10) for Ethereum interaction
MetaMask / wallet connection required for blockchain features

Blockchain / Backend:
Ethereum-compatible network (most likely Sepolia testnet or local Ganache during dev)
One smart contract (address: 0x1Eda52E0776072261874bD05D8d908dCe588Aa71)
Solidity functions include:
issueCertificate(...) → creates credential + stores PDF hash + IPFS CID
revokeCertificate(bytes32) → admin-only invalidate
verifyCertificate(bytes32) → read full details
getStudentCertificates(address) → list student’s cert IDs
getCertificateByPdfHash(bytes32) → reverse lookup from PDF content


Storage:
PDF content → uploaded to IPFS via Pinata (API keys in config.js)
Only IPFS hash + SHA-256 content hash stored on-chain (cheap & secure)

Verification flow (very strong feature):
By ID → direct on-chain lookup
By PDF → compute SHA-256 → look up matching cert ID → verify on-chain → show result


Visual Style & UX Highlights

Strong cyber-retro-futuristic aesthetic:
Neon gradients (cyan/lime/magenta)
Glowing orb effects in header
Inset/outset borders reminiscent of 90s/early 2000s UI
Orbiting animated icons on homepage

Responsive (mobile-friendly nav, adjusted glows/padding)
Consistent navigation across pages with dropdown for “Products”
FAQ page uses <details> + JS for accordion behavior
Community page has events, newsletter, calendar integration hints

Current Status / Development Stage (from code)

Fully functional frontend prototype
Smart contract already deployed (hardcoded address)
Admin issuing flow complete (PDF → hash → Pinata → contract call)
Student & verifier views working
Still in test/demo phase:
Pinata keys are hardcoded (security risk in production)
No backend server (all client-side)
No user authentication beyond wallet ownership
Likely still using testnet or local Ganache


Strengths of the Project

End-to-end verifiable credential flow
Very low-cost verification (anyone can check without account)
Student really owns their credentials (wallet-based)
Clean separation of roles
Beautiful, distinctive visual identity
Easy to extend (add revocation reasons, multi-issuer support, soulbound tokens, etc.)

In one sentence:
Olympianz is a modern, blockchain-powered platform that lets educational institutions issue tamper-proof digital certificates to students, who can then easily share and prove their authenticity to anyone in the world — all secured by Ethereum and IPFS.