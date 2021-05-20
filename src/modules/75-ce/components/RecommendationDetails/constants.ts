import { TimeRange, TimeRangeType } from '@ce/types'

export const ViewTimeRange = [
  {
    label: TimeRange.LAST_7,
    value: TimeRangeType.LAST_7
  },
  {
    label: TimeRange.LAST_30,
    value: TimeRangeType.LAST_30
  }
]

export enum RecommendationType {
  CostOptimized = 'Cost Optimized',
  PerformanceOptimized = 'Performance Optimized',
  Custom = 'Custom'
}

export enum ChartColors {
  'BLUE' = '#25a6f7',
  'GREEN' = '#38d168',
  'GREY' = '#c4c4c4',
  'GREEN_300' = '#d7f4e0'
}
