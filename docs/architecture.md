# MailLaunch — Architecture

## Application Layers

1. CLI: Accepts user commands and arguments.
2. Configuration: Loads YAML and environment settings.
3. Application services: Coordinates campaign operations.
4. Domain logic: Defines campaign states, recipient states, and retry policies.
5. Provider adapters: Implement Gmail and Microsoft Graph sending.
6. Persistence: Stores campaigns, recipients, and send events in SQLite.
7. Security: Manages OAuth and secure token storage.

## Core Data Models

### Campaign

- id
- provider
- status
- createdAt
- updatedAt

### Recipient

- id
- campaignId
- email
- data
- status
- attempts
- lastError

### Send Event

- id
- campaignId
- recipientId
- status
- timestamp
- details

## Important Design Rules

- Persist campaign and recipient data before sending.
- Use database transactions for state changes and daily quota enforcement.
- Use a single campaign coordinator to control sending.
- Keep provider-specific request logic inside provider adapters.
- Inject the sender and delay mechanism into campaign logic for testing.
- Record uncertain delivery outcomes explicitly.
- Never treat a local database transaction as an atomic transaction with an external email provider.

## Provider Interface

Define a common typed interface for sending a message.

Both Gmail and Microsoft adapters must implement that interface.

Normalize provider errors so campaign logic can distinguish authentication, rate-limit, transient, permanent, and uncertain outcomes.

## Database

Use SQLite migrations or a versioned schema initialization process.

Use appropriate indexes and constraints.

Ensure daily counts include successful sends from earlier campaigns.

## Security

Use OS-backed credential storage where practical, or encrypted storage with a separately protected key.

Do not store secrets in the ordinary YAML configuration file.
