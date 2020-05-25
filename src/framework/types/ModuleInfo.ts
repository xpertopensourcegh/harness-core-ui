import type { ModuleName, RouteInfo, KVO } from 'framework'
import type { IconName } from '@wings-software/uikit'

export interface ModuleIcon {
  normal: IconName
  hover?: IconName
  selected?: IconName
}

export interface ModuleInfo {
  module: ModuleName
  title?: string
  route: RouteInfo
  icon: ModuleIcon
  url: (urlParams: KVO<string | number>, urlQueries: KVO<string | number>) => string
  menu: React.ReactNode | JSX.Element
}
