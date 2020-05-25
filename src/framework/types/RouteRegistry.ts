import type { KVO } from './KVO'
import type { RouteInfo } from './RouteInfo'

/** Type to declare routes in a module. Each entry is represented as { [KEY]: RouteInfo } */
export type RouteRegistry = Readonly<KVO<RouteInfo>>
