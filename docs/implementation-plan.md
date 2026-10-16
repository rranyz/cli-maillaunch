# MailLaunch — Implementation Plan

## Phase 1: Foundation

- Initialize TypeScript and npm.
- Configure strict type checking.
- Add configuration loading and validation.
- Initialize SQLite.
- Configure the test runner.

Exit criteria: Application starts, configuration validates, and database initialization passes tests.

## Phase 2: CSV and Templates

- Implement CSV parsing.
- Detect the email column.
- Validate recipient rows.
- Implement template rendering.
- Add unit tests.

Exit criteria: CSV fixtures and template tests pass.

## Phase 3: Provider Authentication and Sending

- Implement Gmail OAuth.
- Implement Microsoft OAuth.
- Implement secure token storage.
- Implement Gmail and Graph sender adapters.
- Add mocked API tests.

Exit criteria: Both adapters construct valid requests and handle provider errors.

## Phase 4: Campaign Engine

- Implement campaign creation and persistence.
- Implement recipient queue state.
- Implement daily quota enforcement.
- Implement random delays and retry policy.
- Implement graceful interruption and resume.

Exit criteria: Recovery, quota, and retry tests pass.

## Phase 5: CLI Commands

- Implement auth.
- Implement send.
- Implement status.
- Implement resume.
- Implement log.
- Add input validation and useful terminal output.

Exit criteria: All required commands work against a test database.

## Phase 6: Quality Assurance

- Run type checking and linting.
- Run all automated tests.
- Verify security and logging.
- Test provider integrations.
- Test a clean installation.

Exit criteria: Required acceptance criteria pass.

## Phase 7: Documentation and Submission

- Complete README.
- Document OAuth setup.
- Document configuration and token storage.
- Document test commands and design decisions.
- Verify repository contains no secrets.

Exit criteria: A reviewer can install, configure, test, and operate the application.
