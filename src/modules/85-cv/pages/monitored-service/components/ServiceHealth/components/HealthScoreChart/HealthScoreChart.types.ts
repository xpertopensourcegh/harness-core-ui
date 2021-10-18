import type { ColumnChartProps } from '@cv/components/ColumnChart/ColumnChart.types'
import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'
import type { RiskData } from 'services/cv'
export interface HealthScoreChartProps {
  serviceIdentifier: string
  envIdentifier: string
  duration: SelectOption
  setHealthScoreData?: (healthScoreData: RiskData[]) => void
  timeFormat?: string
  endTime?: number
  columChartProps?: Pick<ColumnChartProps, 'columnHeight' | 'columnWidth' | 'timestampMarker'>
}
