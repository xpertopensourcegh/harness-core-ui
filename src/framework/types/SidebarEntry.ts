import type { IconName } from '@wings-software/uikit'
import type { RouteParams, SidebarIdentifier } from 'framework/exports'

/** SidebarEntry icons */
export interface SidebarEntryIcon {
  normal: IconName
  hover: IconName
  selected: IconName
}

/** Position of SidebarEntry when being rendered */
export type SidebarEntryPosition = 'TOP' | 'BOTTOM'

/**
 * SidebarEntry represents configuration of a Sidebar item. Almost all SidebarEntry
 * items are bound to a Module route. Some can be hard-link to external
 * service like Documentation or target to open a modal like Profile.
 * Framework should handle both to avoid supporting one, and doing a lot of
 * hacks to support the other when it's required.
 */
export interface SidebarEntry {
  /** Unique identifier */
  sidebarId: SidebarIdentifier

  /** SidebarEntry title - use to show tooltip on hover */
  title: string

  /** SidebarEntry icon set */
  icon: SidebarEntryIcon

  /** SidebarEntry position (default to `TOP`) */
  position?: SidebarEntryPosition

  // TBD
  // onClick?: () => void
  // isSelectable?: boolean

  /** Link when module is clicked */
  url: (routeParams: RouteParams) => string

  /** SidebarEntry menu (optional). Menu is rendered with a layout that supports it. If layout does not support menu, then menu is ignored. */
  sidebarMenu?: React.ReactNode | JSX.Element
}
