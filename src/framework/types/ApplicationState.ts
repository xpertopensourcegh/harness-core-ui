import type { RouteEntry, ModuleEntry } from 'framework'

/**
 * Global Application State.
 */
export interface ApplicationState {
  modules?: ModuleEntry[]

  /** Active route entry */
  routeEntry?: RouteEntry
}
