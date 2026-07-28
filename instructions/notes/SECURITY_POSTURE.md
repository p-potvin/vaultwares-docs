# Security Posture Policy Notes

Welcome to the VaultWares security posture policy! This guide details our overarching approach to securing user data, managing authentication, and designing resilient systems.

## The Core Philosophy: Privacy First

At VaultWares, security is not just about keeping hackers out; it is in service of **privacy**. We secure data so that we can guarantee our users' privacy. If a security measure degrades privacy, it is the wrong measure.

## Guidelines for Secure Design

### 1. Treat Security Work as High-Stakes
Security changes are never trivial. When implementing auth, cryptography, or access controls, verify your assumptions against the actual running code paths and configurations, not just the documentation.

### 2. Map the Trust Boundaries
Keep a clear trust boundary diagram in mind (or written down) whenever network access or authentication is involved. Know exactly where data flows from an untrusted zone (the internet) to a trusted zone (the tailnet) and ensure robust validation happens at that boundary.

### 3. Zero-Knowledge Architecture
Where possible, ensure servers never read, persist, or reconstruct private keys or shared decryption keys. Our systems should ideally have zero-knowledge of the actual content of the data they are storing or transmitting.

### 4. Post-Quantum Cryptography
Where security UX or long-term protocols require it, we prefer post-quantum cryptography (PQC) solutions like ML-KEM to future-proof our encrypted communications against quantum computing threats.

### 5. No Impersonation Features
**Strict Rule:** Do not build or support features that imply user impersonation, bypass KYC (Know Your Customer) checks, or enable document forgery.

## When is it "Done"?
A security or architectural change is complete when you can clearly explain how the change preserves zero-knowledge constraints, maintains strict key-separation, and operates safely across defined trust boundaries.
