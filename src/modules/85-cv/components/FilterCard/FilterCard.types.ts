import type { IconName } from '@wings-software/uicore'

export interface FilterCardItem {
  title: string
  icon: IconName
  iconSize?: number
  count: number
}

export interface FilterCardProps {
  data: Array<FilterCardItem>
  cardClassName?: string
  selected: FilterCardItem
  onChange: (selected: FilterCardItem) => void
}
