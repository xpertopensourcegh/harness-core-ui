import { atom } from 'recoil'
import type { RouteEntry } from 'framework'

export interface ApplicationState {
  /** Active route entry */
  routeEntry?: RouteEntry
}

export const applicationState = atom({
  key: 'applicationState',
  default: {} as ApplicationState
})
