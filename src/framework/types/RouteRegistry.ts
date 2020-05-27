import type { Route } from './Route'

/** Type to declare routes in a module. Each entry is represented as { [KEY]: Route } */
export type RouteRegistry = Readonly<Record<string, Route>>
