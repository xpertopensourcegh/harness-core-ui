# Framework

Framework contains core UI framework.

The resources in this module should not be changed in a daily basic. Changes in this module must be vested and reviewed carefully.

## What includes in Framework?

- Imports of external dependencies (JS modules and styles like Blueprint, UIKit, etc...).
- Logger
- Authentication
- Core Routing
- Application mounting point.

## Rules

### No direct imports

Modules are allowed to import exports from `framework` (exports from `framework/index.ts`) and prohibited to import Framework's resources directly

For example, a module can do:

```js
import { loggerFor } from 'framework'
```

But must not do:

```js
import { loggerFor } from '../../framework/logging/logging'
```

This rule prevents Modules from using internal Framework resources which might never be meant to be used externally.
