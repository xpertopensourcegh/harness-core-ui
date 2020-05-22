import type { ModuleRoutes } from 'framework'
import * as CommonRoutes from 'modules/common/routes'

/**
 * Framework Routes pulls route entries from Modules.
 */
export const Routes: Readonly<ModuleRoutes> = Object.assign({}, CommonRoutes)

//
// TODO: Move Routes.NotFoundPage to the end of Routes and remove
// comment from src/modules/common/routes.tsx
//
