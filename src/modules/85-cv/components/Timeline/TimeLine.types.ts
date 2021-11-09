import type { ChangeSourceTypes } from '@cv/pages/ChangeSource/ChangeSourceDrawer/ChangeSourceDrawer.constants'
import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'

export interface TimeRangeParams {
  startTime?: number
  endTime?: number
}

export interface TimelineProps {
  serviceIdentifier: string | string[]
  environmentIdentifier: string | string[]
  changeCategories?: ('Deployment' | 'Infrastructure' | 'Alert')[]
  changeSourceTypes?: ChangeSourceTypes[]
  isOptionalHealthSource?: boolean
  selectedTimePeriod: SelectOption
  monitoredServiceIdentifier: string | undefined
  timestamps: number[]
  setTimestamps: React.Dispatch<React.SetStateAction<number[]>>
  timeRange?: TimeRangeParams
  setTimeRange: React.Dispatch<React.SetStateAction<TimeRangeParams | undefined>>
  showTimelineSlider?: boolean
  setShowTimelineSlider: React.Dispatch<React.SetStateAction<boolean>>
  resetFilter?: Date
}
