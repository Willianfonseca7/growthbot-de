# Testing Strategy

This document describes the official test structure for GrowthBot DE.
The goal is to keep tests deterministic, behavior-focused, and easy to expand as the AI Sales Platform grows.

## Test types

### Unit tests

Use `tests/unit` for pure logic and isolated UI component behavior.
Prefer fast, deterministic tests with minimal setup.

### Integration tests

Use `tests/integration` for repository, persistence, orchestration, tracking, and service flows.
These tests should validate module collaboration with isolated dependencies and test-specific data stores.

### End-to-end tests

Use `tests/e2e` for browser-level user flows such as dashboard access, authentication, redirects, and recommendation paths.
Keep these tests focused on critical journeys.

## Commands

- `npm test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:coverage`
- `npm run test:e2e`
- `npm run test:e2e:ui`
- `npm run test:all`

## Running tests

### Unit

Run `npm run test:unit`.

### Integration

Run `npm run test:integration`.

### Playwright

Run `npx playwright install chromium` once, then run `npm run test:e2e`.

## Adding new tests

- Put pure logic and isolated component tests in `tests/unit`
- Put repository and multi-module behavior tests in `tests/integration`
- Put browser flows in `tests/e2e`
- Name files with `.test.ts`, `.test.tsx`, or `.spec.ts`

## Mocks

- Prefer focused mocks close to the behavior under test
- Reuse shared mocks from `tests/mocks` only when duplication becomes real
- Avoid large mocks that mirror production implementation details

## Fixtures

- Keep reusable data in `tests/fixtures`
- Prefer small domain-driven fixtures over generic JSON dumps
- Create test-specific fixtures only when reuse does not justify extraction

## Coverage priorities

Prioritize coverage for:

- Conversation Orchestrator
- Intent Detection
- Recommendation Engine
- Prompt Builder
- Repositories
- Tracking
- Follow-up
- Dashboard APIs
- Authentication

## Maintenance rules

- Prefer behavior over implementation detail
- Keep tests deterministic
- Isolate external services
- Never write integration tests against the production database
