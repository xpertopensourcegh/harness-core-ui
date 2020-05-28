import type { RouteParams, NavIdentifier } from 'framework'
import type { IconName } from '@wings-software/uikit'

/** NavEntry icons */
export interface NavEntryIcon {
  normal: IconName
  hover?: IconName
  selected?: IconName
}

/** Position of NavEntry on the top left nav */
export type NavEntryPosition = 'TOP' | 'BOTTOM'

/**
 * NavEntry represents configuration of a nav item. Almost all NavEntry
 * items are bound to a Module route. Some can be hard-link to external
 * service like Documentation or target to open a modal like Profile.
 * Framework must handle both to avoid supporting one, and doing a lot of
 * hacks to support the other when it's required.
 */
export interface NavEntry {
  /** Unique identifier */
  navId: NavIdentifier

  /** NavEntry title - use to show tooltip on hover */
  title: string

  /** NavEntry icon set */
  icon: NavEntryIcon

  /** NavEntry position (default to `TOP`) */
  position?: NavEntryPosition

  // TBD
  // onClick?: () => void
  // isSelectable?: boolean

  /** Link when module is clicked */
  url: (routeParams: RouteParams) => string

  /** NavEntry menu (optional). Menu is rendered with a layout that supports it. If layout does not support menu, then menu is ignored. */
  menu?: React.ReactNode | JSX.Element
}
