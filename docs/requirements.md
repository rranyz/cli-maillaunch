# MailLaunch — Requirements

## Goal

Build a TypeScript CLI application that sends personalized emails using Gmail API or Microsoft Graph and safely manages campaign progress.

## Functional Requirements

- FR-01: Authenticate with Gmail and Microsoft 365.
- FR-02: Load configuration from YAML and environment variables.
- FR-03: Parse CSV files, including BOM and quoted commas.
- FR-04: Detect the recipient email column.
- FR-05: Render `{{variable}}` placeholders using CSV values.
- FR-06: Send email using the selected provider.
- FR-07: Apply configurable random delays.
- FR-08: Retry eligible failures using exponential backoff.
- FR-09: Persist campaigns and recipient states in SQLite.
- FR-10: Enforce a daily sending limit across campaigns.
- FR-11: Resume interrupted campaigns safely.
- FR-12: Write structured send events with ISO 8601 timestamps.
- FR-13: Implement auth, send, status, resume, and log commands.

## Non-Functional Requirements

- NFR-01: TypeScript strict mode.
- NFR-02: macOS and Linux compatibility.
- NFR-03: Secure OAuth token storage.
- NFR-04: Automated unit and integration tests.
- NFR-05: Clear errors and setup documentation.
- NFR-06: No plaintext secrets in configuration or logs.

## Acceptance Criteria

A feature is complete only when its expected behavior is documented, implemented, and tested.

The daily limit must remain enforced after restarts and across multiple campaigns.

Confirmed successful recipients must not be requeued during resume.

Ambiguous send outcomes must not be blindly retried.

Both provider integrations must be tested using mocks and, where practical, controlled authorized accounts.

All required CLI commands must provide useful help and error messages.
