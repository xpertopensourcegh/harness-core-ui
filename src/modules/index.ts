/*
 * This file exports Modules integration points for Framework to consume.
 */
import type { ModuleRoutes } from 'framework'
import * as DXRoutes from './dx/routes'
import * as CommonRoutes from './common/routes'

// TODO: Move Routes.NotFoundPage to the end of Routes and remove
// comment from src/modules/common/routes.tsx
export const Routes: Readonly<ModuleRoutes> = Object.assign({}, DXRoutes, CommonRoutes)
