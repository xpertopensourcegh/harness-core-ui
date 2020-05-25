import type { RouteInfo, ModuleRegistry } from 'framework'

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

  /** Module Registry */
  moduleRegistry?: ModuleRegistry

  /** Active route info */
  routeInfo?: RouteInfo
}
