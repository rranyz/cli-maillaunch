# MailLaunch — Development Progress Tracker

## 1. Project Information

| Property                 | Value                         |
| ------------------------ | ----------------------------- |
| Project                  | MailLaunch                    |
| Project Type             | CLI Application               |
| Language                 | TypeScript                    |
| Runtime                  | Node.js LTS                   |
| Module System            | ESM                           |
| Database                 | SQLite                        |
| Package Manager          | npm                           |
| Development Instructions | `CLAUDE.md`                   |
| Requirements             | `docs/requirements.md`        |
| Architecture             | `docs/architecture.md`        |
| Implementation Plan      | `docs/implementation-plan.md` |
| Testing Strategy         | `docs/testing.md`             |
| Overall Status           | NOT_STARTED                   |
| Current Phase            | Planning                      |
| Current Task             | TASK-001                      |
| Last Updated             | YYYY-MM-DD                    |

> **Instructions for Claude Code:** Update this document as development progresses. Verify repository state, implementation, and test results before changing task statuses. Never invent completed work or test results.

---

## 2. Status Definitions

Use these statuses consistently throughout this document.

| Status        | Meaning                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `NOT_STARTED` | Implementation has not begun.                                                 |
| `IN_PROGRESS` | Implementation is underway.                                                   |
| `BLOCKED`     | Work cannot proceed because of a documented blocker.                          |
| `IMPLEMENTED` | Code exists, but required verification is incomplete or has not fully passed. |
| `VERIFIED`    | Acceptance criteria and required verification checks have passed.             |
| `DEFERRED`    | Work has intentionally been postponed, with a documented reason.              |

### Verification Rules

- Passing a test does not automatically mean the entire feature is verified.
- Record only commands that were actually executed.
- Mark unexecuted checks as `NOT_RUN`.
- Record failed checks as `FAILED`, including a short explanation.
- Distinguish mocked provider tests from successful real-account tests.
- Never mark the overall project complete while required functionality or quality gates remain incomplete.

---

## 3. Overall Development Summary

Update this section when the project status changes significantly.

| Metric                       | Current Value |
| ---------------------------- | ------------- |
| Total Tasks                  | 14            |
| Verified Tasks               | 0             |
| Implemented but Not Verified | 0             |
| In-Progress Tasks            | 0             |
| Blocked Tasks                | 0             |
| Deferred Tasks               | 0             |
| Not-Started Tasks            | 14            |
| Latest Build Result          | NOT_RUN       |
| Latest Type Check Result     | NOT_RUN       |
| Latest Test Suite Result     | NOT_RUN       |
| Real Gmail Integration       | NOT_TESTED    |
| Real Microsoft Integration   | NOT_TESTED    |

> These values are initial estimates, not verified repository facts. Recalculate them from the task table as development progresses.

---

## 4. SDLC Phase Tracking

| Phase                          | Description                                                                          | Status      | Completion Criteria                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------- |
| Phase 1: Requirements Analysis | Review assignment and define acceptance criteria.                                    | NOT_STARTED | Requirements are documented and ambiguities are resolved.                                |
| Phase 2: System Design         | Define modules, database schema, provider adapters, and security decisions.          | NOT_STARTED | Architecture and key design decisions are documented.                                    |
| Phase 3: Environment Setup     | Configure TypeScript, npm, build scripts, and testing.                               | NOT_STARTED | Project builds and the initial tests run.                                                |
| Phase 4: Implementation        | Implement features in small, ordered tasks.                                          | NOT_STARTED | Required application functionality is implemented.                                       |
| Phase 5: Testing               | Verify unit, integration, error-handling, and recovery behavior.                     | NOT_STARTED | Required automated checks pass.                                                          |
| Phase 6: Documentation         | Prepare setup, OAuth, CLI usage, troubleshooting, and testing instructions.          | NOT_STARTED | Documentation reflects verified application behavior.                                    |
| Phase 7: Final Review          | Review evaluation criteria, security, repository contents, and submission readiness. | NOT_STARTED | All required acceptance criteria are satisfied or limitations are explicitly documented. |

Do not mark a phase complete merely because its documentation exists. Verify the phase's completion criteria.

---

## 5. Implementation Task Tracker

Implement tasks in dependency order. Update the status, completion evidence, and notes as work progresses.

| Task ID  | Task                                   | Status      | Dependencies                                     | Notes                                                               |
| -------- | -------------------------------------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| TASK-001 | TypeScript and npm project foundation  | NOT_STARTED | None                                             | Configure ESM, strict TypeScript, build, and test scripts.          |
| TASK-002 | Configuration loading and validation   | NOT_STARTED | TASK-001                                         | Load YAML and validate values using Zod.                            |
| TASK-003 | SQLite schema and repositories         | NOT_STARTED | TASK-001                                         | Persist campaigns, recipients, attempts, and send events.           |
| TASK-004 | CSV parsing and recipient validation   | NOT_STARTED | TASK-001                                         | Handle BOM, quoted commas, empty rows, and invalid input.           |
| TASK-005 | Template rendering                     | NOT_STARTED | TASK-004                                         | Render subject and body using CSV variables.                        |
| TASK-006 | Secure OAuth token storage             | NOT_STARTED | TASK-001, TASK-002                               | Use an OS credential store or suitably protected encrypted storage. |
| TASK-007 | Gmail OAuth and sender adapter         | NOT_STARTED | TASK-006                                         | Implement real Gmail API integration.                               |
| TASK-008 | Microsoft OAuth and sender adapter     | NOT_STARTED | TASK-006                                         | Implement real Microsoft Graph integration.                         |
| TASK-009 | Campaign queue and daily sending limit | NOT_STARTED | TASK-003, TASK-004, TASK-005, TASK-007, TASK-008 | Enforce the configured limit across campaigns and restarts.         |
| TASK-010 | Retry logic and safe resume            | NOT_STARTED | TASK-003, TASK-009                               | Handle transient failures, interruption, and uncertain outcomes.    |
| TASK-011 | Required CLI commands                  | NOT_STARTED | TASK-002, TASK-006, TASK-009, TASK-010           | Implement auth, send, status, resume, and log commands.             |
| TASK-012 | Structured logging and error handling  | NOT_STARTED | TASK-003, TASK-009                               | Record sanitized events and actionable errors.                      |
| TASK-013 | Integration and recovery tests         | NOT_STARTED | TASK-001 through TASK-012 as applicable          | Verify campaign recovery, limits, retries, and provider adapters.   |
| TASK-014 | README and submission review           | NOT_STARTED | All required features                            | Verify setup instructions, documentation, and evaluation criteria.  |

### Task Completion Record

For each task, record the evidence below in the task's notes or in the task-specific section.

- **Task ID:**
- **Status:**
- **Started:**
- **Completed:**
- **Files created or modified:**
- **Acceptance criteria satisfied:**
- **Tests executed:**
- **Outstanding issues:**
- **Next task:**

Do not mark a task `VERIFIED` if any required acceptance criterion remains unmet.

---

## 6. Feature Verification Checklist

Use this checklist to track the application's required behavior independently from implementation tasks.

### 6.1 Configuration

- [ ] Load YAML configuration.
- [ ] Validate configuration using Zod.
- [ ] Reject missing or invalid configuration.
- [ ] Validate provider selection.
- [ ] Validate daily sending limit.
- [ ] Validate minimum and maximum delays.
- [ ] Validate retry settings.
- [ ] Keep real credentials outside source control.
- [ ] Provide a sanitized example configuration.

Status: NOT_STARTED

### 6.2 CSV and Templates

- [ ] Parse UTF-8 BOM correctly.
- [ ] Parse quoted CSV fields and commas.
- [ ] Handle empty rows and malformed CSV.
- [ ] Detect or explicitly configure the email column.
- [ ] Validate recipient email addresses.
- [ ] Identify missing template variables.
- [ ] Render subject templates.
- [ ] Render body templates.
- [ ] Handle empty or missing values according to documented rules.

Status: NOT_STARTED

### 6.3 Authentication and Provider Integrations

- [ ] Implement Gmail OAuth.
- [ ] Implement Microsoft OAuth.
- [ ] Request only necessary OAuth scopes.
- [ ] Persist credentials securely.
- [ ] Refresh expired access tokens when possible.
- [ ] Report actionable reauthentication errors.
- [ ] Send messages using the official Gmail API.
- [ ] Send messages using the official Microsoft Graph API.
- [ ] Test both adapters with mocked API responses.
- [ ] Document authorized real-account testing.

Status: NOT_STARTED

### 6.4 Campaign Persistence and Sending

- [ ] Create persistent campaign records.
- [ ] Persist recipient queue before sending.
- [ ] Persist each recipient's state and attempt count.
- [ ] Persist send events.
- [ ] Enforce the daily limit across campaigns.
- [ ] Preserve daily-limit accounting across application restarts.
- [ ] Prevent concurrent workers from exceeding the limit or claiming the same recipient.
- [ ] Apply configured sending delays.
- [ ] Retry only eligible errors.
- [ ] Respect `Retry-After` where available.
- [ ] Apply bounded exponential backoff with jitter.
- [ ] Handle Ctrl+C and interruption gracefully.
- [ ] Resume campaigns without resending confirmed successes.
- [ ] Handle uncertain delivery outcomes without blindly resending.

Status: NOT_STARTED

### 6.5 Logging and CLI

- [ ] Implement `maillaunch auth gmail`.
- [ ] Implement `maillaunch auth microsoft`.
- [ ] Implement `maillaunch send`.
- [ ] Implement `maillaunch status`.
- [ ] Implement `maillaunch resume`.
- [ ] Implement `maillaunch log`.
- [ ] Provide useful help output.
- [ ] Provide actionable validation errors.
- [ ] Record ISO 8601 timestamps.
- [ ] Record campaign ID, recipient status, and attempt number.
- [ ] Sanitize errors and exclude secrets.
- [ ] Avoid logging full email content.

Status: NOT_STARTED

---

## 7. Test and Quality Gate Results

Record actual results, including failures. Do not overwrite historical failures; append a new entry when a check is run again.

### Latest Results

| Check                            | Status     | Command                              | Notes                                        |
| -------------------------------- | ---------- | ------------------------------------ | -------------------------------------------- |
| Production Build                 | NOT_RUN    | `npm run build`                      | Not yet executed.                            |
| Type Check                       | NOT_RUN    | `npm run typecheck`                  | Not yet executed.                            |
| Automated Tests                  | NOT_RUN    | `npm test`                           | Not yet executed.                            |
| Lint                             | NOT_RUN    | Project lint command, if configured  | Not yet executed.                            |
| Security Review                  | NOT_RUN    | Manual review and applicable checks  | Not yet completed.                           |
| Gmail Mock Integration Tests     | NOT_RUN    | Relevant test command                | Not yet executed.                            |
| Microsoft Mock Integration Tests | NOT_RUN    | Relevant test command                | Not yet executed.                            |
| Real Gmail Test                  | NOT_TESTED | Documented authorized test procedure | Requires authorized account and credentials. |
| Real Microsoft Test              | NOT_TESTED | Documented authorized test procedure | Requires authorized account and credentials. |

### Verification History

| Date       | Task ID  | Command or Check     | Result  | Evidence / Notes         |
| ---------- | -------- | -------------------- | ------- | ------------------------ |
| YYYY-MM-DD | TASK-001 | Initial verification | NOT_RUN | Awaiting implementation. |

For every executed check, record:

1. The actual command.
2. Whether it passed or failed.
3. Relevant error output or a concise failure summary.
4. Any corrective action needed.

A mock integration test must never be recorded as a successful real-provider test.

---

## 8. Issues and Blockers

Record unresolved issues here until they are resolved or explicitly deferred.

| Issue ID  | Related Task | Description                                                                           | Severity | Status | Next Action                                                     |
| --------- | ------------ | ------------------------------------------------------------------------------------- | -------- | ------ | --------------------------------------------------------------- |
| ISSUE-001 | TASK-006     | Select and document the secure token-storage implementation.                          | High     | OPEN   | Evaluate OS credential storage and protected encrypted storage. |
| ISSUE-002 | TASK-010     | Define recovery behavior for uncertain email delivery outcomes.                       | High     | OPEN   | Document recipient states and safe resume rules.                |
| ISSUE-003 | TASK-009     | Verify how the daily limit is reserved and accounted for during concurrent execution. | High     | OPEN   | Define transactional limit enforcement and add tests.           |

These are initial design items to investigate, not confirmed implementation defects. Update their status when the decisions are made.

Issue statuses: `OPEN`, `IN_PROGRESS`, `BLOCKED`, `RESOLVED`, `DEFERRED`.

Add newly discovered issues as needed.

---

## 9. Technical Decisions

Record decisions that affect implementation so future sessions do not silently reverse them.

| Decision ID | Topic              | Decision                                                            | Reason                                                 | Status   |
| ----------- | ------------------ | ------------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| DEC-001     | Language           | TypeScript with strict mode                                         | Improves type safety and maintainability.              | APPROVED |
| DEC-002     | Module system      | ESM                                                                 | Consistent with the selected Node.js setup.            | APPROVED |
| DEC-003     | Persistence        | SQLite                                                              | Supports durable campaign state and resume.            | APPROVED |
| DEC-004     | CLI                | Commander                                                           | Provides command parsing and help output.              | PROPOSED |
| DEC-005     | Configuration      | YAML validated with Zod                                             | Separates user configuration from runtime validation.  | PROPOSED |
| DEC-006     | Testing            | Node.js built-in test runner                                        | Minimizes additional dependencies.                     | PROPOSED |
| DEC-007     | Token storage      | OS credential store or protected encryption                         | Prevents plaintext token storage.                      | PENDING  |
| DEC-008     | Uncertain delivery | Persist an explicit uncertain state and require controlled recovery | Avoids blind duplicate sends after ambiguous outcomes. | PENDING  |

Do not silently change an approved decision. Document the reason and update the relevant architecture documentation when a change is necessary.

---

## 10. Security and Reliability Review

Track these requirements during implementation and final review.

- [ ] No credentials, tokens, or recipient data are committed.
- [ ] OAuth tokens are not stored in plaintext.
- [ ] Logs exclude secrets, authorization headers, and full message content.
- [ ] OAuth scopes are limited to those required.
- [ ] Configuration and CSV data are validated before sending.
- [ ] Daily-limit enforcement is persistent and concurrency-safe.
- [ ] Successful recipients are not resent during normal resume.
- [ ] Uncertain delivery outcomes are distinguishable from confirmed failures.
- [ ] Retries are bounded and restricted to eligible failures.
- [ ] Provider rate limits and retry guidance are respected.
- [ ] Ctrl+C and unexpected process termination are handled safely.
- [ ] Error messages provide useful recovery guidance.
- [ ] Database updates preserve consistent campaign state.

Status: NOT_STARTED

Record outstanding concerns in Section 8.

---

## 11. Documentation and Submission Checklist

- [ ] `README.md` includes a quick-start guide.
- [ ] Supported Node.js versions are documented.
- [ ] Installation and build instructions are verified.
- [ ] Example configuration contains no real secrets.
- [ ] Gmail OAuth setup and permissions are documented.
- [ ] Microsoft OAuth setup and permissions are documented.
- [ ] All required CLI commands have examples.
- [ ] A small test campaign procedure is documented.
- [ ] Campaign status, log inspection, and resume are documented.
- [ ] Daily limit and retry behavior are explained.
- [ ] Linux and macOS setup notes are included where necessary.
- [ ] Troubleshooting guidance reflects actual behavior.
- [ ] Automated testing instructions are verified.
- [ ] `package-lock.json` is committed.
- [ ] `.gitignore` excludes secrets, local databases, and sensitive runtime data as appropriate.
- [ ] No unintended generated files or sensitive data are included in the submission.
- [ ] Every evaluation criterion has been reviewed.

Status: NOT_STARTED

---

## 12. Session Handoff

Update this section at the end of each Claude Code implementation session.

### Latest Session

- **Date:** Not started
- **Task worked on:** None
- **Task status:** NOT_STARTED
- **Summary:** Initial progress tracker created.
- **Files changed:** None recorded.
- **Commands executed:** None recorded.
- **Test results:** NOT_RUN
- **Issues discovered:** See Section 8.
- **Current branch:** Verify with Git.
- **Working tree:** Verify with Git before making claims.

### Current Implementation State

No implementation status has been verified yet. Inspect the repository before treating this statement as current.

### Next Recommended Task

**TASK-001 — TypeScript and npm project foundation**

Expected work:

1. Inspect the existing repository before creating or overwriting files.
2. Confirm the installed Node.js and npm versions.
3. Configure `package.json` for an ESM CLI application.
4. Configure strict TypeScript compilation.
5. Add build, type-check, development, and test scripts.
6. Add a minimal CLI entry point with help output.
7. Verify the initial build, type check, and test runner.
8. Record actual results in this document.

Acceptance criteria:

- The project compiles TypeScript into the configured production output directory.
- The CLI starts from the compiled JavaScript output.
- The CLI displays useful help output.
- Type checking succeeds.
- The test runner executes a minimal automated test successfully.
- All executed commands and results are recorded honestly.

Do not begin a dependent feature until its prerequisites are implemented and verified, unless the implementation plan explicitly justifies a different order.

---

## 13. Project Completion Review

The project can be marked complete only after the required functionality and the Definition of Done in `CLAUDE.md` have been verified.

| Completion Requirement                        | Status      | Evidence |
| --------------------------------------------- | ----------- | -------- |
| Required CLI commands implemented             | NOT_STARTED | Pending  |
| Real Gmail API integration implemented        | NOT_STARTED | Pending  |
| Real Microsoft Graph integration implemented  | NOT_STARTED | Pending  |
| Secure OAuth token handling                   | NOT_STARTED | Pending  |
| CSV and template behavior verified            | NOT_STARTED | Pending  |
| Persistent campaign state and resume verified | NOT_STARTED | Pending  |
| Daily sending limit verified                  | NOT_STARTED | Pending  |
| Retry and error handling verified             | NOT_STARTED | Pending  |
| Uncertain delivery recovery handled           | NOT_STARTED | Pending  |
| Automated test suite passes                   | NOT_STARTED | Pending  |
| TypeScript build and type check pass          | NOT_STARTED | Pending  |
| README and configuration examples verified    | NOT_STARTED | Pending  |
| Security review completed                     | NOT_STARTED | Pending  |
| Evaluation criteria reviewed                  | NOT_STARTED | Pending  |

### Final Status

- **Overall Status:** NOT_STARTED
- **Submission Ready:** NO
- **Final Review Date:** Not started
- **Outstanding Issues:** See Section 8

Do not change `Submission Ready` to `YES` until the required checks have been executed and the results support that conclusion.
