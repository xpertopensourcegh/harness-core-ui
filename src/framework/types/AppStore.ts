import type { Project, Organization } from 'services/cd-ng'
import type { Route } from './Route'
import type { SidebarRegistry } from './SidebarRegistry'

/**
 * Application Store - essential application-level states which are shareable
 * across Framework and Modules. These states are writeable within Frameworks.
 * Modules are allowed to read only.
 */
export interface AppStore {
  /** Sidebar Registry */
  sidebarRegistry?: SidebarRegistry

  /** Active route info */
  route?: Route

  /** Projects */
  projects: Project[]

  /**Organisation Map */
  organisationsMap: Map<string, Organization>
}
