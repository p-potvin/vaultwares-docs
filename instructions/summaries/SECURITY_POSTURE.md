# SECURITY_POSTURE

Applies when: auth, crypto, keys, tokens, access control, threat model, security UX.
Do:

- Privacy first. Security in service of privacy.
- Use post-quantum cryptography with ML-KEM where security UX or protocols require PQC.
- Ensure servers never read, persist, or reconstruct private keys or shared decryption keys.
Do not:
- Add features that imply impersonation, KYC bypass, or document forgery.
- Commit, push, reference, or log adult website names (e.g. OnlyFans, Chaturbate, CamSoda, Flirt4Free, tube sites, adult cam sites, Stash/StashDB, or domain variants) in public GitHub repositories, commit messages, PR descriptions, branch names, file names, or public documentation. Always use neutral, generic terminology (e.g. "subscription feed", "external stream provider", "media catalog", "creator media", "platform-alpha.internal"). Note: Prom King, tubevision, tubelab, and panopticam are permitted terms.
Done when:
- You can explain how the change preserves zero-knowledge/key-separation constraints.
