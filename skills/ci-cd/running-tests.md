# CI/CD & Running Tests

## Environment Variables

Defined in `.env` (gitignored). Access via `process.env`:

```
BASE_URL=https://ecommerce-playground.lambdatest.com
USER_EMAIL=test@example.com
USER_PASSWORD=secret
```

`playwright.config.ts` includes a fallback: `process.env.BASE_URL ?? 'https://ecommerce-playground.lambdatest.io'`

## Local Execution

```bash
npx playwright test                                          # All tests
npx playwright test --project=chromium                       # Chromium only
npx playwright test --grep @smoke                            # By tag
npx playwright test src/tests/specs/foo.spec.ts              # Single file
npx playwright test --headed                                 # Headed mode
npx playwright test --reporter=line                          # Compact reporter
npx playwright show-report                                   # Open HTML report
```

## GitHub Actions with Sharding

Tests are split across 3 parallel runners using Playwright's `--shard` flag.

```yaml
strategy:
  matrix:
    shard: [1, 2, 3]

- name: Run tests
  run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.job-total }} --reporter=blob
```

Each shard uploads a blob report. A `merge-reports` job combines them into a single HTML report.

### Required GitHub Secrets

| Secret | Value |
|--------|-------|
| `USER_EMAIL` | Test account email |
| `USER_PASSWORD` | Test account password |

`BASE_URL` is set directly in the workflow (not a secret).

## Workflow File

`.github/workflows/playwright.yml`
