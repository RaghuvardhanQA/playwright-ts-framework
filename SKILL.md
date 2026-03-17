---
name: playwright-ts-framework
description: Use when writing Playwright tests in TypeScript, implementing Page Object Model, using ActionUtils/ElementUtils/ExpectUtils/PageUtils/ApiUtils, navigating the ecommerce playground site, writing assertions, handling locators, making API requests, setting up CI/CD with sharding, running tests with tags (@smoke, @regression), debugging test failures, working with multi-tab flows, dialogs, file uploads, iframes, or configuring the test framework.
license: MIT
metadata:
  author: RaghuvardhanQA
  version: "1.0"
---

# Playwright TypeScript Framework Skill

Comprehensive guidance for working in this Playwright + TypeScript e-commerce test framework targeting [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.com). Follows Page Object Model with centralized utilities and a Winston logger.

## Activity-Based Reference Guide

### Writing New Tests

**When to use**: Creating test files, writing test cases, implementing test scenarios

| Activity | Reference Files |
|----------|----------------|
| **Structuring test code with POM** | [page-object-model.md](skills/core/page-object-model.md), [project-structure.md](skills/core/project-structure.md) |
| **Writing a spec file** | [test-spec-pattern.md](skills/core/test-spec-pattern.md) |
| **Understanding design rules** | [design-rules.md](skills/core/design-rules.md) |
| **Setting up imports and paths** | [project-structure.md](skills/core/project-structure.md) |
| **Writing API-layer tests** | [api-utils.md](skills/utils/api-utils.md), [test-spec-pattern.md](skills/core/test-spec-pattern.md) |

### Using Utilities

**When to use**: Interacting with elements, asserting state, navigating pages, making HTTP requests

| Activity | Reference Files |
|----------|----------------|
| **Clicking, filling, selecting, uploading** | [action-utils.md](skills/utils/action-utils.md) |
| **Getting locators, reading text, waiting** | [element-utils.md](skills/utils/element-utils.md) |
| **Asserting visibility, text, state, URL** | [expect-utils.md](skills/utils/expect-utils.md) |
| **Navigating pages, multi-tab, wait states** | [page-utils.md](skills/utils/page-utils.md) |
| **HTTP GET / POST / PUT / DELETE requests** | [api-utils.md](skills/utils/api-utils.md) |

### Target Application

**When to use**: Finding selectors, understanding URL routes, knowing which flows to automate

| Activity | Reference Files |
|----------|----------------|
| **Finding page URLs and routes** | [target-application.md](skills/reference/target-application.md) |
| **Common selectors for auth, cart, checkout** | [target-application.md](skills/reference/target-application.md) |
| **Key user flows to automate** | [target-application.md](skills/reference/target-application.md) |

### CI/CD & Execution

**When to use**: Running tests locally, configuring GitHub Actions, debugging pipeline failures

| Activity | Reference Files |
|----------|----------------|
| **Running tests locally** | [running-tests.md](skills/ci-cd/running-tests.md) |
| **Setting up GitHub Actions with sharding** | [running-tests.md](skills/ci-cd/running-tests.md) |
| **Configuring environment variables / secrets** | [running-tests.md](skills/ci-cd/running-tests.md) |

---

## Quick Decision Tree

```
What are you doing?
│
├── Writing a new test?
│   ├── New page interaction → skills/core/page-object-model.md
│   ├── New spec file → skills/core/test-spec-pattern.md
│   └── API verification → skills/utils/api-utils.md
│
├── Using a utility?
│   ├── Click / fill / select → skills/utils/action-utils.md
│   ├── Get locator / wait → skills/utils/element-utils.md
│   ├── Assert something → skills/utils/expect-utils.md
│   ├── Navigate / tabs → skills/utils/page-utils.md
│   └── HTTP request → skills/utils/api-utils.md
│
├── Looking for a selector or URL?
│   └── skills/reference/target-application.md
│
└── Running or configuring CI?
    └── skills/ci-cd/running-tests.md
```

---

## Test Validation Loop

1. Write the page object and spec
2. Run `npx playwright test <spec> --project=chromium --reporter=line`
3. Review failures — use `--headed` or trace viewer for visual debugging
4. Fix and re-run
5. Run **3 times** for stability verification before committing
