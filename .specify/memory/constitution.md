<!--
SYNC IMPACT REPORT
==================
Version change: NEW → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6 principles)
  - Key Standards
  - Technology Constraints
  - Functional Constraints
  - Non-Functional Constraints
  - Success Criteria
  - Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section exists, will align with new principles
  ✅ spec-template.md - Standards align with spec-driven requirements
  ✅ tasks-template.md - Task organization supports spec-driven workflow
  ⚠ No template updates needed - all templates already support spec-driven development
Follow-up TODOs: None
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development
All features MUST be explicitly defined in specifications before implementation. No manual coding allowed - all outputs MUST be generated through prompts following the workflow: `sp.constitution → sp.specify → plan → tasks → implementation`. This ensures reproducibility - any agent can regenerate the same system from specs without manual changes.

### II. Security-First Architecture
JWT-based authentication is mandatory for ALL API endpoints. Backend MUST validate JWT tokens on every request, and task data MUST always be scoped to the authenticated user with strict isolation. This enforces security boundaries at every layer and prevents unauthorized data access.

### III. Correctness and Consistency
API behavior MUST match specification exactly. REST APIs MUST follow standard HTTP semantics and status codes. All agent outputs MUST be deterministic and auditable. This ensures predictable system behavior and enables trust in automated generation.

### IV. Reproducibility
The entire system MUST be regenerable from specifications without manual changes. Any agent following the spec-driven workflow should produce identical results. This enables collaborative development, knowledge transfer, and system recovery.

### V. Separation of Concerns
Authentication, backend logic, and frontend UI MUST be clearly isolated. Frontend communicates with backend ONLY through documented REST APIs using `Authorization: Bearer <JWT>` headers. This modularity enables independent development, testing, and scaling of each layer.

### VI. Production Readiness
The architecture MUST follow clean patterns that are scalable and maintainable. Stateless backend authentication, enforced token expiry (e.g., 7 days), and proper error handling are required. No technical debt or shortcuts that compromise long-term viability.

## Key Standards

- **Specification-First**: All features MUST be defined in specs before implementation. No feature outside the written spec may be implemented.
- **Authentication**: Authentication is MANDATORY for **ALL** API endpoints. JWT tokens MUST be validated on every backend request.
- **User Isolation**: Task data MUST always be scoped to the authenticated user. Ownership enforced on every CRUD operation.
- **REST Compliance**: REST API MUST follow standard HTTP semantics and status codes.
- **API Communication**: Frontend MUST communicate with backend **ONLY** through documented REST APIs.
- **Security**: Environment variables MUST be used for all secrets (no hard-coded keys).
- **Auditability**: All agent outputs MUST be deterministic and auditable.

## Technology Constraints

- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT enabled)
- **Auth Transport**: `Authorization: Bearer <JWT>`
- **Spec Workflow**: `sp.constitution → sp.specify → plan → tasks → implementation`
- **Coding Rule**: ❌ No manual coding allowed

## Functional Constraints

- **Complete Feature Set**: MUST implement **all 5 Basic Level features** as a web application
- **Multi-User Support**: MUST support **multi-user access with strict isolation**
- **Persistent Storage**: Persistent storage is mandatory (no in-memory storage)
- **API Compliance**: API endpoints MUST exactly match the defined routes and behaviors
- **Authentication Required**: Backend MUST reject unauthenticated requests with `401 Unauthorized`
- **Ownership Enforcement**: Task ownership MUST be enforced on every CRUD operation
- **Secret Sharing**: JWT secret MUST be shared using `BETTER_AUTH_SECRET` in both services

## Non-Functional Constraints

- **Responsive UI**: UI must work on both mobile and desktop
- **Error Handling**: Predictable and clear error handling
- **Stateless Auth**: Stateless backend authentication
- **Token Expiry**: Token expiry enforced (e.g., 7 days)
- **Clean Separation**: Clean separation between frontend and backend services

## Success Criteria

- **User Authentication**: Users can sign up and sign in successfully
- **JWT Validation**: JWT tokens are issued and validated correctly
- **Data Isolation**: Authenticated users can only view and modify their own tasks
- **API Compliance**: All REST endpoints behave exactly as specified
- **Data Persistence**: Data persists across sessions using Neon PostgreSQL
- **Security Enforcement**: Requests without valid JWT return `401 Unauthorized`
- **Reproducibility**: Entire system can be regenerated from specs without manual changes
- **Project Quality**: Project passes hackathon review for **process, specifications, and architecture**

## Governance

### Authority
This constitution is the authoritative source for all development decisions. It supersedes all other practices and documentation where conflicts exist.

### Amendments
Constitution amendments require:
1. Documentation of the change rationale
2. Update of CONSTITUTION_VERSION following semantic versioning
    - MAJOR: Backward incompatible governance/principle removals or redefinitions
    - MINOR: New principle/section added or materially expanded guidance
    - PATCH: Clarifications, wording, typo fixes, non-semantic refinements
3. Migration plan for any breaking changes
4. Update of related templates (spec, plan, tasks)

### Compliance Review
- All PRs/reviews must verify compliance with constitution principles
- Complexity beyond standard patterns must be justified in plan.md complexity tracking
- All features must pass the Constitution Check in plan.md before implementation
- Better Auth (JWT enabled) authentication flow must be followed

### Violation Handling
If a principle must be violated:
1. Document in plan.md Complexity Tracking table with justification
2. Explain why simpler alternatives were rejected
3. Obtain explicit approval before proceeding
4. Record in ADR (Architecture Decision Record) if decision has long-term consequences

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
