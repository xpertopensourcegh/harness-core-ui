import { atom } from 'recoil'
import type { RouteEntry, ModuleEntry } from 'framework'

export interface ApplicationState {
  modules?: ModuleEntry[]

  /** Active route entry */
  routeEntry?: RouteEntry
}

export const applicationState = atom({
  key: 'applicationState',
  default: {} as ApplicationState
})
