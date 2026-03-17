# Project Structure & Naming Conventions

## Directory Layout

```
src/
├── main/
│   ├── resources/
│   │   ├── constants/timeouts.ts          # Timeout constants
│   │   ├── parameters/optional-parameters.ts  # Custom option types
│   │   └── setup/
│   │       ├── custom-logger.ts           # Winston reporter
│   │       └── page-setup.ts             # Custom test fixture
│   └── utils/
│       ├── action-utils.ts               # Click, fill, hover, drag, dialogs
│       ├── api-utils.ts                  # HTTP GET/POST/PUT/DELETE via page.request
│       ├── element-utils.ts              # Locators, state checks, waits
│       ├── expect-utils.ts               # Assertions (visibility, text, state)
│       └── page-utils.ts                 # Navigation, tabs, page state
└── tests/
    ├── pages/                            # Page Object files — one file per page
    │   ├── landing-page.ts
    │   ├── login-page.ts
    │   ├── my-account-page.ts
    │   ├── search-results-page.ts
    │   ├── register-page.ts
    │   ├── product-page.ts
    │   ├── cart-page.ts
    │   └── checkout-page.ts
    ├── specs/                            # Test spec files (*.spec.ts)
    └── data/                             # Test data (JSON)
```

## Naming Conventions

| Thing            | Convention        | Example                         |
|------------------|-------------------|---------------------------------|
| Files            | kebab-case        | `checkout-page.ts`              |
| Directories      | kebab-case        | `tests/pages/`                  |
| Functions        | camelCase         | `clickAddToCart()`              |
| Page functions   | verb-first        | `verify*()`, `click*()`, `navigate*()`, `fill*()`, `select*()` |
| Constants        | UPPER_SNAKE_CASE  | `DEFAULT_TIMEOUT`               |
| Types/Interfaces | PascalCase        | `ClickOptions`                  |
| Spec files       | `*.spec.ts`       | `checkout-flow.spec.ts`         |
| Tags             | `@tagname`        | `@smoke`, `@regression`         |

## Imports Reference

```typescript
// Test fixture (use instead of Playwright's native `test`)
import { test } from '@src/main/resources/setup/page-setup';

// Utilities
import * as ActionUtils from '@src/main/utils/action-utils';
import * as ElementUtils from '@src/main/utils/element-utils';
import * as ExpectUtils from '@src/main/utils/expect-utils';
import * as PageUtils from '@src/main/utils/page-utils';
import * as ApiUtils from '@src/main/utils/api-utils';

// Timeouts
import { TIMEOUTS } from '@src/main/resources/constants/timeouts';
// TIMEOUTS.INSTANT = 1000, SMALL = 5000, DEFAULT = 30000, LONG = 60000, VERY_LONG = 120000

// Custom option types
import {
  ClickOptions, FillOptions, HoverOptions, SelectOptions, ExpectOptions
} from '@src/main/resources/parameters/optional-parameters';
```
