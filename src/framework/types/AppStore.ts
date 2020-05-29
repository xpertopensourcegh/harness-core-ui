import type { Route, SidebarRegistry } from 'framework/exports'

/**
 * Application Store - essential application-level states which are shareable
 * across Framework and Modules. These states are writeable within Frameworks.
 * Modules are allowed to read only.
 */
export interface AppStore {
  /** TBD: isAuthenticated */
  isAuthenticated?: boolean

  /** TBD: License info */
  // licenseInfo?: LicenseInfo

  /** Sidebar Registry */
  sidebarRegistry?: SidebarRegistry

  /** Active route info */
  route?: Route
}
