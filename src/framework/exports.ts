/*
 * This file contains Framework exports which can be consumed by Modules.
 * Note: You should never export internal Framework entities like LayoutManager, RouteMounter, SidebarMounter, etc...
 */
export type { RouteParams } from './types/RouteParams'
export type { Route, NestedRoute } from './types/Route'
export type { RouteRegistry } from './types/RouteRegistry'
export type { SidebarEntry, SidebarEntryPosition } from './types/SidebarEntry'
export type { SidebarRegistry } from './types/SidebarRegistry'
export type { AppStore } from './types/AppStore'

export { ModuleName } from './types/ModuleName'
export { SidebarIdentifier } from './types/SidebarIdentifider'
export { PageLayout } from './layout/PageLayout'
export { loggerFor } from './logging/logging'
export { isRouteActive, routeParams } from './route/RouteMounter'
export { Sidebar } from './layout/sidebar/Sidebar'
export { useAppStoreReader, useAppStoreWriter } from './hooks/useAppStore'
export { routeURL } from './utils/framework-utils'
