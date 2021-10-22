import type { MutateMethod } from 'restful-react'
import type { Color, FontVariation } from '@wings-software/uicore'
import type {
  MonitoredServiceListItemDTO,
  RestResponseHealthMonitoringFlagResponse,
  SetHealthMonitoringFlagQueryParams,
  SetHealthMonitoringFlagPathParams,
  PageMonitoredServiceListItemDTO
} from 'services/cv'
import type { FilterCardItem } from '@cv/components/FilterCard/FilterCard.types'
import type { DependencyData } from '@cv/components/DependencyGraph/DependencyGraph.types'

export interface FilterEnvInterface {
  searchTerm?: string
  environmentIdentifier?: string
}

export interface ContextMenuActionsProps {
  onEdit?(): void
  onDelete?(): void
  titleText: string
  contentText: string | JSX.Element
  confirmButtonText?: string
  deleteLabel?: string
  editLabel?: string
}

export type setHealthMonitoringFlagType = MutateMethod<
  RestResponseHealthMonitoringFlagResponse,
  void,
  SetHealthMonitoringFlagQueryParams,
  SetHealthMonitoringFlagPathParams
>

interface MonitoredServiceViewsProps {
  monitoredServiceListData?: PageMonitoredServiceListItemDTO
  refetchMonitoredServiceList: () => void
  selectedFilter?: FilterCardItem
  setSelectedFilter: React.Dispatch<React.SetStateAction<FilterCardItem | undefined>>
  onEditService: (identifier?: string) => void
  onDeleteService: (identifier?: string) => Promise<void>
  healthMonitoringFlagLoading?: boolean
  setHealthMonitoringFlag: setHealthMonitoringFlagType
}

export interface MonitoredServiceListViewProps extends MonitoredServiceViewsProps {
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export interface MonitoredServiceGraphViewProps extends MonitoredServiceViewsProps {
  monitoredServiceDependencyData: DependencyData | null
}

export interface GraphSummaryCardProps {
  monitoredService: MonitoredServiceListItemDTO
  setHealthMonitoringFlag: setHealthMonitoringFlagType
  onEditService: (identifier?: string) => void
  onDeleteService: (identifier?: string) => Promise<void>
  healthMonitoringFlagLoading?: boolean
  refetchMonitoredServiceList: () => void
}

export interface ServiceHealthScoreProps {
  monitoredService: MonitoredServiceListItemDTO
  labelVariation?: FontVariation
  color?: Color
}
