import type { ModuleName, RouteEntry, KVO } from 'framework'
import type { IconName } from '@wings-software/uikit'

export interface ModuleIcon {
  normal: IconName
  hover?: IconName
  selected?: IconName
}

export interface ModuleEntry {
  module: ModuleName
  title?: string
  route: RouteEntry
  icon: ModuleIcon
  url: (urlParams: KVO<string | number>, urlQueries: KVO<string | number>) => string
  menu: React.ReactNode | JSX.Element
}
