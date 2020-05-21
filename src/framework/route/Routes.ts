import type { ModuleRouteEntries } from 'framework'
import { CommonRoutes } from 'modules/common/routes'

/**
 * Framework Routes pulls route entries from Modules.
 */
export const Routes: ModuleRouteEntries = Object.assign({}, CommonRoutes)
