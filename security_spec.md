# Security Specification - Atlas Travel Club

## 1. Data Invariants
1. **PII Protection**: Subscriber emails in `/subscribers` must not be queryable by arbitrary public users (`list` operations disallowed for public scraping).
2. **Strict Schema Integrity**: Any document written to `/subscribers/{subscriberId}` must contain only permitted fields (`email`, `createdAt`, `status`, optional `membershipTier`, `welcomeEmailSent`, `welcomeEmailSentAt`) with valid types and boundary constraints.
3. **No Update Gaps / Poisoning**: Updates and deletes from unauthorized actors are denied.
4. **Welcome Confirmation Logs**: `/welcome_emails/{emailId}` only accepts sanitized records with confirmed recipient email, matching invite code, valid subject line, and RFC timestamp.
5. **ID Poisoning Guard**: All path parameters must satisfy `isValidId()`.

## 2. The Dirty Dozen Payloads (Expected: PERMISSION_DENIED)
1. **Ghost Field / Shadow Key Attack**:
   `{ "email": "traveller@domain.com", "createdAt": "2026-09-20T19:00:00Z", "status": "pending", "isAdmin": true }` -> REJECT (keys.hasOnly violation)
2. **PII Blanket List Scraping**:
   `GET /subscribers` -> REJECT (Public list prohibited)
3. **Huge String Denial-of-Wallet Attack**:
   `{ "email": "a".repeat(500) + "@example.com", ... }` -> REJECT (size > 254)
4. **Invalid Email Format**:
   `{ "email": "not-an-email", "createdAt": "2026-09-20T19:00:00Z", "status": "pending" }` -> REJECT (regex mismatch)
5. **State Spoofing Attack**:
   `{ "email": "user@test.com", "status": "superuser_override", "createdAt": "2026-09-20T19:00:00Z" }` -> REJECT (status enum invalid)
6. **Path Traversal / Poisoned ID**:
   `POST /subscribers/../../root_compromise` -> REJECT (isValidId check fails)
7. **Document Overwrite / Hijack**:
   `UPDATE /subscribers/{subscriberId}` -> REJECT (public updates denied)
8. **Malicious Subscriber Deletion**:
   `DELETE /subscribers/{subscriberId}` -> REJECT (delete prohibited)
9. **Corrupted Welcome Email Log**:
   `{ "recipientEmail": "user@test.com", "status": "sent" }` -> REJECT (missing required fields)
10. **Arbitrary Unregistered Collection Injection**:
    `POST /admin_keys/secret_doc` -> REJECT (catch-all default deny)
11. **Type Confusion Attack**:
    `{ "email": 12345, "createdAt": false, "status": "pending" }` -> REJECT (type validation fails)
12. **Welcome Email Key Injection**:
    `{ "recipientEmail": "test@test.com", "subject": "Hi", "sentAt": "now", "status": "sent", "inviteCode": "VIP123", "smtpPassword": "evil" }` -> REJECT (hasOnly violation)
