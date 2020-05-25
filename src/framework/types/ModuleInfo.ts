import type { ModuleName, RouteInfo, URLParams, URLQueries } from 'framework'
import type { IconName } from '@wings-software/uikit'

/** Module icons */
export interface ModuleIcon {
  normal: IconName
  hover?: IconName
  selected?: IconName
}

/** Position of module on the top left nav */
export type ModulePosition = 'TOP' | 'BOTTOM'

/** Module binding information */
export interface ModuleInfo {
  /** Name of the module */
  module: ModuleName

  /** Module title - use to show tooltip on hover */
  title: string

  /** Module icon set */
  icon: ModuleIcon

  /** Module position on the top left nav (default to `ModulePosition.`) */
  position?: ModulePosition

  /** Default route when module is clicked */
  route: RouteInfo

  /** Link when module is clicked */
  url: (urlParams: URLParams, urlQueries: URLQueries) => string

  /** Module menu */
  menu?: React.ReactNode | JSX.Element
}
