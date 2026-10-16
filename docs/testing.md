# MailLaunch — Testing Strategy and Quality Assurance

## 1. Purpose

This document defines the testing strategy, test cases, verification commands, and quality gates for MailLaunch.

MailLaunch is a TypeScript CLI application that sends emails through the official Gmail API or Microsoft Graph API. It supports CSV recipient imports, personalized templates, OAuth authentication, SQLite campaign persistence, retries, daily sending limits, structured logs, and safe campaign resumption.

Testing must verify correctness, reliability, security, error handling, and maintainability without sending real emails during automated tests.

This document must be followed together with:

- `CLAUDE.md` — Project instructions, architecture rules, security requirements, quality gates, and Definition of Done.
- `docs/requirements.md` — Required functionality and acceptance criteria.
- `docs/architecture.md` — Module responsibilities and technical design.
- `docs/implementation-plan.md` — Ordered implementation tasks.
- `docs/progress.md` — Actual development status, test results, issues, and session handoff.

If testing instructions conflict with the original developer assignment or approved requirements, identify the conflict before changing expected behavior.

---

## 2. Testing Principles

Claude Code must follow these principles throughout development.

1. **Test actual behavior.** Tests must exercise application logic rather than merely confirm that files or functions exist.
2. **Test incrementally.** Add tests with each feature instead of postponing all testing until the end.
3. **Use deterministic tests.** Inject or mock clocks, delays, random-number generation, database dependencies, and provider responses when appropriate.
4. **Never send real emails in automated tests.** Provider integrations must use mocked HTTP responses or equivalent isolated test doubles.
5. **Do not permanently replace real integrations with mocks.** Mocks are for tests; production code must use the official Gmail API and Microsoft Graph API.
6. **Verify failure paths.** Include invalid input, authentication errors, network failures, rate limits, persistence failures, and interrupted campaigns.
7. **Protect sensitive information.** Tests must not require committing real credentials, OAuth tokens, or recipient data.
8. **Record actual results.** Never claim that a command, test, integration, or feature passed unless it was actually verified.
9. **Test recovery behavior.** A successful initial send is not sufficient; verify interruption, restart, and resume behavior.
10. **Keep scope controlled.** Prefer the Node.js built-in test runner and existing dependencies. Introduce another testing dependency only when it provides clear value.

---

## 3. Testing Tools and Environment

### 3.1 Required Tools

| Tool                         | Purpose                                    |
| ---------------------------- | ------------------------------------------ |
| Node.js LTS                  | Runtime and built-in test runner           |
| TypeScript                   | Static type checking and compilation       |
| npm                          | Dependency and script management           |
| Node.js `node:test`          | Automated test execution                   |
| Node.js `node:assert/strict` | Assertions                                 |
| SQLite test database         | Persistence and campaign lifecycle tests   |
| Mocked HTTP/API responses    | Gmail and Microsoft provider adapter tests |
| Git                          | Change review and regression tracking      |

Use the versions supported by the project's `package.json` and lockfile.

### 3.2 Recommended npm Scripts

The project should provide the following scripts, adjusting names only when there is a documented reason.

- `npm run build` — Compile TypeScript into the production output directory.
- `npm run typecheck` — Run TypeScript checks without generating output.
- `npm test` — Run the complete automated test suite.
- `npm run lint` — Run linting if a linter has been configured.
- `npm start -- --help` — Verify CLI help using the compiled application, if supported by the package scripts.

Use the actual commands defined in `package.json`. Do not assume a script exists before inspecting the project.

The complete test suite must be executable with a documented, repeatable command.

### 3.3 Test Environment Requirements

- Automated tests must not depend on a real Gmail or Microsoft account.
- Tests must not depend on production credentials or live recipient lists.
- Use temporary directories and isolated SQLite databases where practical.
- Ensure test data is deterministic and disposable.
- Clean up temporary files and database connections after tests.
- Avoid tests that depend on real waiting periods or uncontrolled random delays.
- Avoid concurrent tests sharing mutable state unless concurrency itself is being tested.
- Keep tests compatible with supported Linux and macOS environments.

---

## 4. Test Categories

### 4.1 Unit Tests

Test individual modules in isolation.

Required areas:

- Configuration loading and validation.
- CSV parsing and email-column detection.
- Recipient email validation.
- Template rendering.
- Daily-limit calculations.
- Retry eligibility and backoff calculations.
- Campaign state transitions.
- Log formatting and sensitive-data sanitization.
- Error classification.

Unit tests should run quickly and should not make network requests.

### 4.2 Integration Tests

Test interactions between application modules.

Required areas:

- Configuration loading through the CLI.
- Campaign persistence in SQLite.
- Recipient queue creation and status updates.
- Daily-limit enforcement across campaigns.
- Campaign interruption and resumption.
- Provider adapters with mocked API responses.
- Token refresh and reauthentication handling.
- Structured logging of send outcomes.

Use isolated test databases and mocked external services.

### 4.3 CLI Tests

Verify that command-line commands:

- Are registered correctly.
- Display useful help output.
- Reject invalid arguments and missing required inputs.
- Return appropriate success or failure exit codes.
- Display actionable error messages.
- Do not expose secrets in terminal output.

Required commands:

- `maillaunch auth gmail`
- `maillaunch auth microsoft`
- `maillaunch send`
- `maillaunch status`
- `maillaunch resume`
- `maillaunch log`

Use the compiled CLI for production-entry-point smoke tests. Unit tests may invoke internal command handlers where appropriate.

### 4.4 Authorized Real-Account Tests

Real-provider testing is separate from automated testing.

When credentials and authorized test accounts are available, document a controlled manual test for each provider. Use a small, explicitly approved test campaign and verify the provider's response and resulting campaign state.

Do not make real-account tests a prerequisite for ordinary unit-test execution. Report them as `NOT_TESTED` when they have not been performed.

---

## 5. Required Test Cases

## 5.1 Configuration Validation

Test the following scenarios:

| ID      | Scenario                                    | Expected Result                                     |
| ------- | ------------------------------------------- | --------------------------------------------------- |
| CFG-001 | Valid YAML configuration                    | Configuration loads successfully.                   |
| CFG-002 | Missing configuration file                  | Actionable error is reported.                       |
| CFG-003 | Malformed YAML                              | Parsing fails safely with a useful error.           |
| CFG-004 | Missing required field                      | Validation identifies the invalid or missing field. |
| CFG-005 | Unsupported provider                        | Configuration is rejected.                          |
| CFG-006 | Invalid daily limit                         | Configuration is rejected.                          |
| CFG-007 | Negative or nonnumeric delay                | Configuration is rejected.                          |
| CFG-008 | Minimum delay exceeds maximum delay         | Configuration is rejected.                          |
| CFG-009 | Invalid retry configuration                 | Configuration is rejected.                          |
| CFG-010 | Real credentials absent from example config | Example remains safe to commit.                     |

Also verify that configuration errors do not reveal secrets.

## 5.2 CSV Parsing and Recipient Validation

Test the following scenarios:

| ID      | Scenario                        | Expected Result                                                                        |
| ------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| CSV-001 | Valid CSV file                  | Rows are parsed correctly.                                                             |
| CSV-002 | UTF-8 BOM at the beginning      | Headers are recognized correctly.                                                      |
| CSV-003 | Quoted fields containing commas | Values are parsed without splitting quoted fields.                                     |
| CSV-004 | Empty rows                      | Empty rows are handled according to documented rules.                                  |
| CSV-005 | Missing email column            | Validation fails with an actionable message.                                           |
| CSV-006 | Invalid recipient email         | Invalid recipient is rejected or recorded according to the approved policy.            |
| CSV-007 | Duplicate recipient rows        | Behavior follows documented duplicate-recipient rules.                                 |
| CSV-008 | Malformed CSV                   | Invalid input is reported safely.                                                      |
| CSV-009 | Missing template column         | Missing variable is identified before sending when preflight validation can detect it. |
| CSV-010 | Empty input file                | No messages are sent, and a useful error or empty-campaign result is reported.         |

Do not silently discard invalid recipients without recording or reporting the outcome.

## 5.3 Template Rendering

Test the following scenarios:

| ID      | Scenario                                    | Expected Result                                                   |
| ------- | ------------------------------------------- | ----------------------------------------------------------------- |
| TMP-001 | Basic `{{name}}` substitution               | Correct value is rendered.                                        |
| TMP-002 | Multiple variables                          | All supported variables are rendered.                             |
| TMP-003 | Subject template                            | Subject variables are rendered correctly.                         |
| TMP-004 | Body template                               | Body variables are rendered correctly.                            |
| TMP-005 | Missing variable                            | A clear validation error or documented policy is applied.         |
| TMP-006 | Empty variable value                        | Behavior follows documented rules.                                |
| TMP-007 | Unknown variable                            | Missing data is not silently substituted with unintended content. |
| TMP-008 | Braces that do not form a valid placeholder | They are handled according to the documented template grammar.    |
| TMP-009 | Special characters in recipient data        | Values are preserved correctly.                                   |

Subject and body templates must use consistent substitution rules.

Template rendering must not silently produce misleading messages because a required variable is absent.

## 5.4 OAuth and Token Storage

Test the following scenarios:

| ID       | Scenario                                           | Expected Result                                                             |
| -------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| AUTH-001 | Valid stored credentials                           | Credentials can be retrieved through the approved storage interface.        |
| AUTH-002 | Expired access token with valid refresh capability | Refresh is attempted and handled correctly.                                 |
| AUTH-003 | Failed token refresh                               | Sending stops safely and reauthentication is requested.                     |
| AUTH-004 | Revoked or invalid credentials                     | An actionable authentication error is reported.                             |
| AUTH-005 | Missing credentials                                | Sending does not proceed.                                                   |
| AUTH-006 | Token-storage read failure                         | An actionable error is reported.                                            |
| AUTH-007 | Token-storage write failure                        | Authentication is not reported as successful.                               |
| AUTH-008 | Log inspection                                     | Access tokens, refresh tokens, and client secrets are absent.               |
| AUTH-009 | Unauthorized provider scope                        | The application reports the authorization problem without exposing secrets. |

Test the token-storage interface with test credentials. Do not commit real tokens or encryption keys.

Verify the selected storage mechanism's actual security properties; merely storing a token in a file is not sufficient to demonstrate secure storage.

## 5.5 Gmail API Adapter

Use mocked HTTP responses or an equivalent isolated provider test double.

| ID        | Scenario                     | Expected Result                                                                      |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| GMAIL-001 | Valid send request           | The adapter sends the expected API request.                                          |
| GMAIL-002 | MIME message construction    | Headers, subject encoding, and body are correctly constructed.                       |
| GMAIL-003 | Base64URL encoding           | The encoded message uses the expected representation.                                |
| GMAIL-004 | Successful provider response | The adapter returns a confirmed acceptance result.                                   |
| GMAIL-005 | HTTP 401                     | Token refresh or controlled reauthentication handling occurs.                        |
| GMAIL-006 | HTTP 429                     | Rate-limit handling follows provider guidance.                                       |
| GMAIL-007 | Transient HTTP 5xx           | The error is classified for eligible retry.                                          |
| GMAIL-008 | Permanent API error          | The error is not retried indefinitely.                                               |
| GMAIL-009 | Network failure              | The failure is classified correctly, including uncertain delivery where appropriate. |
| GMAIL-010 | Malformed provider response  | The adapter handles the response safely.                                             |

Verify that the Gmail request uses the expected endpoint and authorization flow without exposing credentials in logs.

## 5.6 Microsoft Graph API Adapter

Use mocked HTTP responses or an equivalent isolated provider test double.

| ID     | Scenario                            | Expected Result                                                                      |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------ |
| MS-001 | Valid send request                  | The adapter sends the expected Graph API request.                                    |
| MS-002 | Message payload                     | Recipient, subject, body, and supported message options are mapped correctly.        |
| MS-003 | Successful provider response        | The adapter interprets the documented success response correctly.                    |
| MS-004 | HTTP 401                            | Token refresh or controlled reauthentication handling occurs.                        |
| MS-005 | HTTP 429                            | Rate-limit handling follows provider guidance.                                       |
| MS-006 | Transient HTTP 5xx                  | The error is classified for eligible retry.                                          |
| MS-007 | Permanent API error                 | The error is not retried indefinitely.                                               |
| MS-008 | Network failure                     | The failure is classified correctly, including uncertain delivery where appropriate. |
| MS-009 | Malformed provider response         | The adapter handles the response safely.                                             |
| MS-010 | Authorization or permission failure | An actionable error is reported.                                                     |

Verify that the adapter uses the official Microsoft Graph API and appropriate OAuth permissions.

## 5.7 Campaign Persistence

Test the following scenarios:

| ID     | Scenario                      | Expected Result                                         |
| ------ | ----------------------------- | ------------------------------------------------------- |
| DB-001 | Create campaign               | Campaign metadata is persisted.                         |
| DB-002 | Create recipient queue        | Recipients are persisted before sending starts.         |
| DB-003 | Update recipient status       | The new status survives reopening the database.         |
| DB-004 | Persist send attempt          | Attempt count and associated event are saved.           |
| DB-005 | Reopen application            | Existing campaign state is available.                   |
| DB-006 | Database constraint violation | The error is handled without silently corrupting state. |
| DB-007 | Interrupted transaction       | Incomplete changes do not leave invalid partial state.  |
| DB-008 | Repeated status query         | The query reflects persisted state accurately.          |

Database operations that must remain consistent should use appropriate transactions.

## 5.8 Daily Sending Limit

Test the following scenarios:

| ID        | Scenario                                    | Expected Result                                                          |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| LIMIT-001 | Campaign below limit                        | Eligible messages can be processed.                                      |
| LIMIT-002 | Campaign reaches the limit                  | Further sending is prevented.                                            |
| LIMIT-003 | Multiple campaigns share a limit            | Aggregate sending respects the configured limit.                         |
| LIMIT-004 | Application restart                         | Existing daily usage is retained.                                        |
| LIMIT-005 | Two workers request the last available slot | No more than one permitted slot is consumed.                             |
| LIMIT-006 | Provider rejection                          | Usage accounting follows the documented definition of a send attempt.    |
| LIMIT-007 | Uncertain delivery                          | Recovery cannot blindly bypass the limit or duplicate a send.            |
| LIMIT-008 | Day boundary                                | Daily accounting resets according to the documented timezone and policy. |

Define clearly whether the daily limit counts provider-accepted messages, attempted submissions, or another explicitly documented unit. Do not silently change that definition.

Daily-limit reservation and accounting must be persistent and concurrency-safe.

## 5.9 Retry Logic and Rate Limiting

Test the following scenarios:

| ID        | Scenario                                | Expected Result                                                           |
| --------- | --------------------------------------- | ------------------------------------------------------------------------- |
| RETRY-001 | Eligible transient network error        | A retry is scheduled within the configured policy.                        |
| RETRY-002 | HTTP 429 with `Retry-After`             | The retry honors provider guidance.                                       |
| RETRY-003 | Eligible HTTP 5xx                       | Bounded exponential backoff with jitter is applied.                       |
| RETRY-004 | Permanent HTTP 4xx                      | No inappropriate repeated retries occur.                                  |
| RETRY-005 | Maximum attempts reached                | The operation stops and the final outcome is persisted.                   |
| RETRY-006 | Token refresh failure                   | Sending stops when user intervention is required.                         |
| RETRY-007 | Retry interruption                      | Attempt state remains recoverable.                                        |
| RETRY-008 | Repeated transient failures             | Retry count remains bounded.                                              |
| RETRY-009 | Delay generation                        | Delay remains within the configured bounds and is deterministic in tests. |
| RETRY-010 | Provider indicates an uncertain outcome | The system does not blindly resubmit the message.                         |

Inject clocks, delay functions, and randomness so tests do not need to wait for real 60–180 second intervals.

The implementation must distinguish a definite rejection from an outcome where the provider may already have accepted the message.

## 5.10 Campaign Resume and Interruption

This is a critical reliability area.

Test the following scenarios:

| ID         | Scenario                           | Expected Result                                                             |
| ---------- | ---------------------------------- | --------------------------------------------------------------------------- |
| RESUME-001 | Resume a completed campaign        | No successful recipients are sent again.                                    |
| RESUME-002 | Resume after a definite failure    | Eligible recipients follow the documented retry policy.                     |
| RESUME-003 | Resume after process interruption  | Persisted campaign state is restored.                                       |
| RESUME-004 | Resume with mixed recipient states | Each recipient is handled according to its persisted state.                 |
| RESUME-005 | Reopen SQLite after restart        | Recipient status and campaign progress remain consistent.                   |
| RESUME-006 | Duplicate resume invocation        | Concurrent work does not claim the same recipient improperly.               |
| RESUME-007 | Uncertain delivery outcome         | The recipient is not automatically resent without a safe recovery decision. |
| RESUME-008 | Daily limit reached before resume  | No further sends occur until the documented limit policy permits them.      |
| RESUME-009 | Authentication required            | Sending stops and the user receives an actionable instruction.              |
| RESUME-010 | Ctrl+C during campaign             | State is preserved as far as possible, and recovery behavior is documented. |

A local database cannot guarantee exactly-once delivery if the provider accepts a message but the process crashes before recording confirmation.

The application must distinguish:

- Confirmed success.
- Definite failure.
- Retryable failure.
- Skipped recipient.
- Uncertain delivery outcome.
- Daily limit reached.

Do not treat an uncertain result as a confirmed failure merely to make resume simpler.

## 5.11 Structured Logging and Error Handling

Test the following scenarios:

| ID      | Scenario                    | Expected Result                                  |
| ------- | --------------------------- | ------------------------------------------------ |
| LOG-001 | Successful send             | A structured success event is recorded.          |
| LOG-002 | Failed send                 | A structured failure event is recorded.          |
| LOG-003 | Retry scheduled             | The retry event includes the attempt number.     |
| LOG-004 | Daily limit reached         | The limit event is recorded.                     |
| LOG-005 | Event timestamp             | Timestamp uses ISO 8601 format.                  |
| LOG-006 | Campaign identification     | Event includes the campaign ID where applicable. |
| LOG-007 | Recipient status            | Event includes the appropriate status.           |
| LOG-008 | Sensitive-data sanitization | Secrets and authorization headers are removed.   |
| LOG-009 | Error formatting            | Error descriptions are useful and sanitized.     |
| LOG-010 | Log command                 | Users can inspect stored campaign events.        |

Logs must not contain access tokens, refresh tokens, client secrets, authorization headers, or full email bodies.

Avoid recording unnecessary personal information.

## 5.12 CLI Behavior

Test each required command.

| ID      | Command                     | Expected Result                                                  |
| ------- | --------------------------- | ---------------------------------------------------------------- |
| CLI-001 | `maillaunch --help`         | Displays application usage and commands.                         |
| CLI-002 | `maillaunch auth gmail`     | Starts or reports Gmail authentication status appropriately.     |
| CLI-003 | `maillaunch auth microsoft` | Starts or reports Microsoft authentication status appropriately. |
| CLI-004 | `maillaunch send`           | Validates inputs before campaign sending.                        |
| CLI-005 | `maillaunch status`         | Displays persisted campaign status.                              |
| CLI-006 | `maillaunch resume`         | Resumes eligible work safely.                                    |
| CLI-007 | `maillaunch log`            | Displays structured campaign events.                             |
| CLI-008 | Missing required arguments  | Displays actionable usage guidance.                              |
| CLI-009 | Invalid arguments           | Rejects invalid input.                                           |
| CLI-010 | Unexpected runtime error    | Exits safely without printing secrets.                           |

Use the actual command syntax defined in the implemented CLI and README.

---

## 6. Mocking and Dependency Injection

Use dependency injection where it helps isolate external effects.

Recommended dependencies to inject or wrap:

- Email sender.
- Clock or current-time provider.
- Delay function.
- Random-number generator.
- Token provider or credential store.
- Database connection or repository.
- HTTP transport where supported by the provider SDK.
- Logger.

### Mocking Rules

- Mock external network calls during automated tests.
- Use a temporary SQLite database for persistence tests.
- Do not mock the logic under test so extensively that the test becomes meaningless.
- Verify relevant request payloads and response handling.
- Test permanent and transient errors separately.
- Test unexpected responses.
- Keep mocks limited to test code.
- Never use real credentials in fixtures or test logs.

For uncertain delivery, include scenarios where a request times out after the mock simulates provider acceptance but before the application receives a response. Verify that the application records or exposes the uncertainty instead of blindly resending.

---

## 7. Test Data and Fixtures

Store reusable test fixtures under `tests/fixtures/` where appropriate.

Suggested structure:

    tests/
    ├── unit/
    │   ├── config.test.ts
    │   ├── csv.test.ts
    │   ├── templates.test.ts
    │   ├── retry.test.ts
    │   └── logging.test.ts
    ├── integration/
    │   ├── storage.test.ts
    │   ├── campaign.test.ts
    │   ├── gmail.test.ts
    │   ├── microsoft.test.ts
    │   └── resume.test.ts
    ├── cli/
    │   └── commands.test.ts
    └── fixtures/
        ├── recipients-valid.csv
        ├── recipients-bom.csv
        ├── recipients-quoted.csv
        ├── recipients-invalid.csv
        ├── template-subject.txt
        └── template-body.txt

This is a suggested structure. Adjust it to the actual source layout and avoid creating empty or unnecessary test files.

All fixture data must be synthetic and must not contain real recipient information or credentials.

---

## 8. Running Quality Checks

Inspect `package.json` before running commands. The following commands are expected only if the corresponding scripts have been configured.

### 8.1 TypeScript Type Check

    npm run typecheck

Expected result: exit code zero and no TypeScript errors.

### 8.2 Production Build

    npm run build

Expected result: successful compilation into the configured output directory.

### 8.3 Automated Tests

    npm test

Expected result: the complete automated test suite runs and passes.

### 8.4 Linting

    npm run lint

Run only if the project defines a lint script.

Expected result: no unresolved lint errors under the project's configured rules.

### 8.5 Production CLI Smoke Test

After a successful build, use the actual compiled CLI entry point to check its help output. For example:

    node dist/main.js --help

Adjust the path if the configured build output differs.

Expected result: the CLI starts from compiled JavaScript and displays useful help without requiring real OAuth credentials.

### 8.6 Full Verification Sequence

Before declaring a feature or release ready, run the applicable checks:

1. Type checking.
2. Production build.
3. Relevant automated tests.
4. Complete automated test suite.
5. CLI smoke test.
6. Security and error-handling review.
7. Documentation consistency review.

Record the actual result of every executed check in `docs/progress.md`.

A command that has not been executed must remain `NOT_RUN`.

---

## 9. Quality Gates and Definition of Done

These rules directly implement the quality requirements in `CLAUDE.md`.

A feature may be marked `VERIFIED` only when:

- [ ] The required implementation exists.
- [ ] Relevant acceptance criteria are satisfied.
- [ ] External inputs are validated.
- [ ] Relevant failure paths are handled.
- [ ] Relevant automated tests have passed.
- [ ] TypeScript type checking has passed.
- [ ] Production build has passed.
- [ ] Existing automated tests remain passing.
- [ ] Security requirements have been reviewed.
- [ ] Documentation is updated where behavior or setup changed.
- [ ] Actual verification results are recorded in `docs/progress.md`.
- [ ] Remaining limitations are documented.

Run the complete test suite and build before final project completion.

If a required check fails, the affected task must not be marked `VERIFIED`.

If a check cannot be run because of an environmental dependency, record the blocker explicitly. Do not report the check as passed.

---

## 10. Mapping to the Evaluation Criteria

| Evaluation Area | Weight | Testing Evidence                                                                                              |
| --------------- | -----: | ------------------------------------------------------------------------------------------------------------- |
| Correctness     |    30% | CSV/template tests, provider adapter tests, daily-limit tests, persistence and resume tests.                  |
| Code Quality    |    25% | Strict TypeScript checking, modular tests, readable assertions, maintainable fixtures, and regression checks. |
| Error Handling  |    20% | Authentication, validation, rate-limit, retry, network, persistence, and uncertain-delivery tests.            |
| Tests           |    15% | Repeatable unit and integration suites covering required scenarios.                                           |
| Documentation   |    10% | Accurate setup instructions, test commands, provider setup, troubleshooting, and honest verification records. |

The percentages describe the assignment's evaluation weighting. They are not test coverage percentages.

Do not claim that a category has passed solely because test files exist. Verify the relevant behaviors.

---

## 11. Updating `docs/progress.md`

After every implementation task, Claude Code must update `docs/progress.md` in accordance with Section 14 of `CLAUDE.md`.

Record:

- Task ID and current status.
- Test files added or modified.
- Commands actually executed.
- Actual pass or fail results.
- Relevant test failures and their causes.
- Acceptance criteria still unmet.
- Known limitations and blockers.
- Recommended next task.

Use `IMPLEMENTED` when code exists but required verification is incomplete or has not fully passed.

Use `VERIFIED` only after the required acceptance criteria and verification checks have passed.

Use `NOT_RUN` for checks that have not been executed.

Use `FAILED` for executed checks that failed.

Distinguish mocked provider tests from authorized real-provider tests.

The progress tracker must reflect actual evidence, not assumptions or intended behavior.

---

## 12. Final Release Verification

Before submission, review all evaluation criteria and execute the applicable verification commands.

### Required Final Checks

- [ ] Build succeeds.
- [ ] Type check succeeds.
- [ ] Complete automated test suite passes.
- [ ] CLI help and required commands are verified.
- [ ] Gmail adapter tests pass with mocked API responses.
- [ ] Microsoft Graph adapter tests pass with mocked API responses.
- [ ] CSV parsing and template rendering are verified.
- [ ] Persistent campaign state is verified across restarts.
- [ ] Daily sending limit is verified across campaigns and restarts.
- [ ] Retry exhaustion and provider rate-limit handling are verified.
- [ ] Campaign resume skips confirmed successes.
- [ ] Uncertain delivery outcomes are handled safely.
- [ ] OAuth storage and log sanitization are reviewed.
- [ ] README commands match actual behavior.
- [ ] No secrets or real recipient data are committed.
- [ ] Known limitations are documented.
- [ ] `docs/progress.md` reflects actual results.

### Final Verification Report

At release, record:

- **Verification date:**
- **Git commit or revision:**
- **Node.js version:**
- **npm version:**
- **Build result:**
- **Type-check result:**
- **Automated test result:**
- **CLI smoke-test result:**
- **Gmail mocked integration result:**
- **Microsoft mocked integration result:**
- **Authorized Gmail test:** PASSED / FAILED / NOT_TESTED
- **Authorized Microsoft test:** PASSED / FAILED / NOT_TESTED
- **Security review result:**
- **Outstanding issues:**
- **Submission readiness:**

Do not fill in results until they have actually been verified.

The final report must distinguish successful automated tests, mocked provider tests, and real-account operations. A successful mock test does not establish that a real provider account is configured correctly.
