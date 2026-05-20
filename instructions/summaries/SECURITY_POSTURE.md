# SECURITY_POSTURE
Applies when: auth, crypto, keys, tokens, access control, threat model, security UX.
Do:
- Privacy first. Security in service of privacy.
- Use post-quantum cryptography with ML-KEM where security UX or protocols require PQC.
- Ensure servers never read, persist, or reconstruct private keys or shared decryption keys.
Do not:
- Add features that imply impersonation, KYC bypass, or document forgery.
Done when:
- You can explain how the change preserves zero-knowledge/key-separation constraints.
