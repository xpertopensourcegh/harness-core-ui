// eslint-disable-next-line import/order
import type { PermissionsContextProps } from 'framework/rbac/PermissionsContext'
import type { LicenseStoreContextProps } from 'framework/LicenseStore/LicenseStoreContext'
import type { AppStoreContextProps } from 'framework/AppStore/AppStoreContext'

/**
 * Parent contexts which consists of all the context used in the parent app
 */
export interface ParentContext {
  appStoreContext: React.Context<AppStoreContextProps>
  permissionsContext: React.Context<PermissionsContextProps>
  licenseStoreProvider: React.Context<LicenseStoreContextProps>
}

export interface RenderChildAppProps {
  parentContextObj: ParentContext
  renderUrl: string
  mountPoint: HTMLDivElement
}

/**
 * function to render child app inside the parent
 */
export type RenderChildApp = (params: RenderChildAppProps) => void

export { AppStoreContextProps, LicenseStoreContextProps, PermissionsContextProps }
