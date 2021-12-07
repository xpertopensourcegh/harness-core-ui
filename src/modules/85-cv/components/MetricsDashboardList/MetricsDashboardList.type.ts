import type { IconName } from '@wings-software/uicore'
import type { UseGetReturn } from 'restful-react'
import type { StringKeys } from 'framework/strings'

export interface MetricsDashboardListProps<T> {
  manualQueryInputTitle: StringKeys
  defaultItemIcon: IconName
  tableItemMapper: (item: T) => TableDashboardItem
  selectedDashboardList: T[]
  tableTitle: StringKeys
  dashboardsRequest: UseGetReturn<any, any, any>
}

export type TableDashboardItem = {
  name?: string
  id?: string
}
export type TableData = {
  selected: boolean
  dashboard: {
    name?: string
    path?: string
  }
}
