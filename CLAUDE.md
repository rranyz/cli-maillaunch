# MailLaunch — Project Instructions for Claude Code

## 1. Project Overview

MailLaunch is a TypeScript-based CLI application for managing email campaigns using Gmail API and Microsoft Graph API.

The application must support CSV recipient imports, personalized email templates, OAuth authentication, persistent campaign state, retries, daily sending limits, structured logs, and campaign resumption.

This is a CLI application, not a web application.

## 2. Technology Stack

- Runtime: Node.js LTS
- Language: TypeScript with strict mode enabled
- Module system: ESM
- CLI: Commander
- Configuration: YAML
- Database: SQLite
- Validation: Zod
- Gmail integration: Google APIs
- Microsoft integration: Microsoft Graph using an appropriate OAuth library
- Testing: Node.js built-in test runner (use another framework only if it provides a clear benefit)
- Package manager: npm

Use current, mutually compatible stable package versions and commit `package-lock.json`.

## 3. Source of Truth

Before implementing a feature, read:

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/implementation-plan.md`
- `docs/testing.md`
- `docs/progress.md`

The original developer assignment is the primary source for required functionality.

If requirements conflict, identify the conflict and ask for clarification instead of silently changing expected behavior.

## 4. Architecture Rules

Keep responsibilities separated:

- `cli/`: Parse commands and arguments.
- `config/`: Load and validate configuration.
- `auth/`: Manage provider authentication and token storage.
- `csv/`: Parse and validate recipient files.
- `templates/`: Render personalized messages.
- `sender/`: Implement provider-specific email sending.
- `campaign/`: Manage campaign lifecycle, queue, retries, and resume.
- `storage/`: Manage SQLite connections, schema, and persistence.
- `logging/`: Record structured send events.

Keep provider-specific logic out of the campaign service.

Use dependency injection where it improves testability, especially for email senders, delays, clocks, and database dependencies.

Avoid unnecessary abstractions and overengineering.

## 5. TypeScript Standards

- Enable `strict` in `tsconfig.json`.
- Avoid `any`; use `unknown` and narrow types where appropriate.
- Define explicit types for configuration, campaign states, recipients, provider responses, and errors.
- Validate external input at runtime.
- Use `async/await` consistently.
- Handle rejected promises and unexpected errors.
- Keep functions focused and reasonably small.
- Use named exports unless there is a good reason not to.
- Do not use TypeScript type assertions to bypass errors without justification.

## 6. Security Rules

- Never commit real OAuth credentials, access tokens, refresh tokens, or recipient data.
- Never store tokens in plaintext.
- Prefer an OS credential store or encrypted token storage with a separately protected key.
- Never log secrets or authorization headers.
- Request only the OAuth scopes needed for the application.
- Validate CSV input and configuration before sending.
- Do not automatically resend emails with uncertain delivery outcomes.
- Respect provider policies and applicable email-sending requirements.

## 7. Campaign Reliability

- Persist the campaign and recipient queue before sending.
- Persist each recipient's state and each relevant send event.
- Enforce the daily sending limit across campaigns and application restarts.
- Prevent concurrent workers from exceeding the limit or claiming the same recipient.
- Retry only eligible errors and respect provider retry guidance.
- Refresh expired access tokens when possible.
- Stop safely if reauthentication is required.
- Handle Ctrl+C and process interruption gracefully.
- Distinguish confirmed success, definite failure, and uncertain delivery outcomes.

A local database cannot guarantee exactly-once delivery when the provider may have accepted a message before the process crashes.

## 8. Development Workflow

Follow these steps for each feature:

1. Read the relevant requirements and architecture documentation.
2. Explain the proposed implementation before editing files.
3. Identify affected files, dependencies, and acceptance criteria.
4. Implement only the approved scope.
5. Add or update tests.
6. Run type checking, tests, and linting when configured.
7. Review security, error handling, and regression risks.
8. Summarize changed files, test results, and remaining issues.

Do not implement the entire project in one large change.

Do not claim that a test passes unless it has actually been executed and passed.

Do not replace real provider integrations with permanent mock implementations. Mocks are for tests only.

## 9. Required Commands

Implement these commands:

- `maillaunch auth gmail`
- `maillaunch auth microsoft`
- `maillaunch send`
- `maillaunch status`
- `maillaunch resume`
- `maillaunch log`

Include useful help output and actionable validation errors.

## 10. Quality Gates

Before considering a feature complete:

- TypeScript compilation passes.
- Relevant automated tests pass.
- Existing tests remain passing.
- Acceptance criteria are satisfied.
- Errors are handled appropriately.
- No secrets or sensitive data are exposed.
- Documentation is updated when behavior or setup changes.

## 11. Scope Control

This project is a lightweight CLI tool.

Do not add a web dashboard, React application, Docker requirement, unrelated infrastructure, or third-party email delivery service.

- Compile TypeScript to JavaScript for production execution (`npm run build`, run from `dist/`).
- Send email directly through Gmail API or Microsoft Graph API.
- Do not introduce a frontend, dashboard, Express server, or unnecessary backend service.
- Keep the architecture modular but small: prefer straightforward functions and a small number of modules over elaborate abstractions.
- Do not introduce a framework or dependency unless it provides clear value.
- Use SQLite for campaign persistence and resume.
- Preserve all required assignment features, especially secure OAuth storage, daily limits, retry logic, structured logging, and safe campaign resumption.
- Prioritize correctness, reliability, security, and readable code over architectural complexity.

When a requirement is ambiguous, explain the options and recommend the simplest safe implementation before proceeding.

## 12. Completion Report

At the end of each implementation task, report:

- What was implemented.
- Files created or modified.
- Design decisions.
- Tests executed and their actual results.
- Known limitations.
- Recommended next task.

## 13. Evaluation Criteria and Definition of Done

The project will be evaluated on correctness (30%), code quality (25%), error handling (20%), tests (15%), and documentation (10%).

### 1. Correctness — 30%

- Implement real email sending through the official Gmail API and Microsoft Graph API.
- Support CSV parsing, `{{variable}}` template substitution, subject rendering, and body rendering.
- Persist campaigns and recipient statuses in SQLite.
- Implement `resume` so confirmed successful recipients are not sent again.
- Enforce the configured daily sending limit across campaigns and application restarts.
- Persist recipient status and campaign progress after each sending result.
- Validate configuration, CSV columns, recipient email addresses, and delay settings before sending.
- Test provider integrations using mocked HTTP/API responses and provide documented steps for authorized real-account testing.
- Never report an email as sent unless the provider confirms acceptance.
- Handle uncertain delivery outcomes without blindly resending and potentially duplicating emails.

### 2. Code Quality — 25%

- Use TypeScript with strict type checking.
- Keep modules small and focused on one responsibility.
- Use clear names, consistent formatting, and meaningful error messages.
- Separate CLI commands, campaign orchestration, persistence, CSV parsing, template rendering, logging, and provider-specific sending logic.
- Avoid unnecessary classes, design patterns, frameworks, and dependencies.
- Validate external input at application boundaries.
- Keep secrets, OAuth tokens, and personal recipient data out of source control and ordinary logs.
- Do not leave incomplete implementations, placeholder sending logic, or silently ignored errors in required features.

### 3. Error Handling — 20%

- Handle missing files, invalid YAML, malformed CSV, missing template variables, and invalid email addresses.
- Handle expired access tokens and failed token refresh.
- Retry transient network errors, HTTP 429 responses, and eligible HTTP 5xx responses using bounded exponential backoff with jitter.
- Respect the provider's Retry-After response when available.
- Do not retry permanent errors indefinitely.
- Stop sending and display an actionable message when authentication requires user intervention.
- Persist failures and attempt counts so the user can inspect and recover a campaign.
- Record structured logs with ISO 8601 timestamps, campaign ID, recipient status, attempt number, and a sanitized error description.
- Distinguish confirmed failures from uncertain delivery outcomes.
- Never log client secrets, access tokens, refresh tokens, or full email content.

### 4. Tests — 15%

- Use the Node.js built-in test runner unless another dependency is justified.
- Test CSV parsing, including UTF-8 BOM, quoted commas, empty rows, and invalid input.
- Test template substitution, missing variables, and subject/body rendering.
- Test email-column detection and recipient validation.
- Test daily-limit enforcement across multiple campaigns and application restarts.
- Test retries, retry exhaustion, authentication failures, and rate limiting with mocked dependencies.
- Test campaign interruption and resume behavior, including skipping confirmed successful recipients.
- Test both provider adapters without sending real emails during automated tests.
- Inject or mock time, delays, and provider responses so tests remain fast and deterministic.
- Run the build, type check, and complete test suite before marking a feature complete.

### 5. README and Documentation — 10%

- Provide a quick-start guide designed to take a reviewer less than 10 minutes under normal prerequisites.
- Document supported Node.js versions, installation, configuration, OAuth setup, and required provider permissions.
- Include an example configuration without real credentials.
- Document all required CLI commands with copyable examples.
- Explain how to send a small test campaign, inspect status and logs, and resume an interrupted campaign.
- Document the daily limit, retry behavior, security precautions, and troubleshooting steps.
- Explain how to run the build, type check, and tests.
- Include platform-specific notes for Linux and macOS where needed.
- Never claim a command or feature works unless it has been implemented and verified.

### Definition of Done

A feature is complete only when:

1. Its implementation is present and uses real application logic.
2. Input validation and relevant failure cases are handled.
3. Automated tests cover its core behavior.
4. Type checking, production build, and all automated tests pass.
5. Documentation reflects the actual implementation.
6. No secrets or real recipient data are committed.
7. Any known limitation is documented honestly.

Before completion, review the project against every evaluation criterion and report actual test results. Do not claim success for tests or real-provider operations that were not executed.

## 14. Development Progress Tracking

Use `docs/progress.md` as the central development progress tracker.

### 14.1 Required Behavior

Before starting any implementation task:

1. Read `CLAUDE.md` and the relevant project documentation.
2. Read `docs/progress.md`.
3. Inspect the current Git status and relevant source files.
4. Compare the recorded progress with the actual implementation and test results.
5. Identify the next incomplete task from `docs/implementation-plan.md`.
6. Explain the proposed task, affected files, acceptance criteria, and verification plan before making changes.

Do not assume that the progress tracker is accurate without checking the repository.

### 14.2 Task Status Definitions

Use these statuses consistently:

- `NOT_STARTED`: Work has not begun.
- `IN_PROGRESS`: Work is actively being implemented.
- `BLOCKED`: Work cannot proceed because of a documented blocker.
- `IMPLEMENTED`: Code has been written, but all required verification has not yet passed.
- `VERIFIED`: Acceptance criteria have been satisfied and the required checks have actually passed.
- `DEFERRED`: Work has intentionally been postponed, with a documented reason.

Never mark a task `VERIFIED` solely because the code appears correct or Claude Code believes it should work.

### 14.3 During Implementation

Update `docs/progress.md` when meaningful progress occurs:

- Record the task ID and current status.
- Document significant implementation decisions.
- Record files created, modified, or removed.
- Identify blockers and unexpected issues.
- Record any scope changes and their reasons.

Keep updates concise, factual, and consistent with the actual repository state.

### 14.4 After Each Implementation Task

Before finishing a task:

1. Run the relevant tests and checks.
2. Record the exact commands executed and their actual results.
3. Update the task status using the definitions above.
4. Document acceptance criteria that remain incomplete.
5. Record known limitations, unresolved issues, and security concerns.
6. Identify the recommended next task.
7. Update the session handoff section so the next Claude Code session can continue without guessing.

If a check was not executed, record `NOT_RUN`. If it failed, record `FAILED` and summarize the failure. Never invent test results.

### 14.5 Verification Rules

- `IMPLEMENTED` means the implementation exists but verification is incomplete or has not fully passed.
- `VERIFIED` means the task's acceptance criteria and required verification have passed.
- A task may be partially implemented even if some tests pass.
- A successful unit test does not prove that a real provider integration works.
- Mocked provider tests must be identified as mocked tests.
- Real Gmail or Microsoft account operations must be reported as verified only when they have actually been performed successfully.
- Do not mark the entire project complete while required tasks or quality gates remain incomplete.

### 14.6 Source of Truth

Use the following evidence when reconciling progress:

1. Original developer assignment and approved requirements.
2. Actual source code, configuration, database schema, and Git state.
3. Actual test and command results.
4. `docs/progress.md` as the human-readable progress record.

If the progress tracker conflicts with the implementation or test evidence, correct the tracker and explain the discrepancy.

Never delete unresolved issues or mark unfinished work complete just to make the progress report look better.

### 14.7 Session Handoff

At the end of every implementation session, ensure `docs/progress.md` records:

- Last completed or attempted task.
- Current implementation state.
- Files changed.
- Commands and tests executed, with actual results.
- Outstanding issues or blockers.
- Exact next recommended task.
- Any relevant instructions needed to continue safely.

Keep the tracker concise enough to review at the beginning of every session.

If `docs/progress.md` does not exist, create it using the project implementation plan as the initial task list. Mark tasks `NOT_STARTED` until repository evidence supports another status.
