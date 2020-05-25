import type { RouteInfo, NavRegistry } from 'framework'

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

  /** Nav Registry */
  navRegistry?: NavRegistry

  /** Active route info */
  routeInfo?: RouteInfo
}
