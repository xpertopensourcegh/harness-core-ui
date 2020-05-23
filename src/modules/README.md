# Modules

A module represents a Harness functional business logic. Each belongs to a respective team and can be developed independently.

- CD: Continuous Deployment
- CE: Continuous Efficiency
- CI: Continuous Integration
- CV: Continuous Verification
- DX: Developer eXperience
- COMMON: Platform

## Pages

TBD

## Components

TBD

## Modals

TBD

## Utils

TBD

## Code Splitting Note

Code Splitting is done on page level which makes pages independent from each other in terms of size. The only thing left to optimize is to bundle page-level 3rd-party dependencies (dependencies used specifically for a page and not widely adopted across the whole app) per page instead of everything together in a single vendor bundle. The vendor bundle should contain only dependencies that are approved to be used across UIKit, Framework, and Modules. If a page in one module needs a specific dependency, it's free to do so but the dependency will be bundled along with that page itself and is not in the shared vendor bundle.

There are multiple benefits of this code splitting architecture :

- Vendor bundle is more cacheable (less likely to be changed daily).
- A page specific dependency does not have impact to other pages/other modules/and core Framework.
- Potential issue caused by page specific dependencies are scoped in pages where they are used.

For this optimization to be materialized, some extra webpack configuration needs to be done.

## Rules

### No direct imports from Framework and other Modules

A module must not import direct resources from another module. If a module wants to introduce a component for other module to use, that component must be exported explicitly from that module `index.ts`. For example:

_Allowed:_

```js
import { ConnectorModal } from 'modules/common'
```

_Not allowed:_

```js
import { GCPSettingModal } from 'modules/common/modal/GCPSettingModal'
```

This rule prevents module from using internal/private resources from another module.
