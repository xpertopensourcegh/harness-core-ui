import type { KVO } from './KVO'
import type { RouteEntry } from './RouteEntry'

/** Type to declare routes in a module. Each entry is represented as { [KEY]: RouteEntry } */
export type ModuleRoutes = Readonly<KVO<RouteEntry>>
