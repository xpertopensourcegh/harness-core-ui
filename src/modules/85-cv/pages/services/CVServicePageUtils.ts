import type { TimeSeriesMetricDataDTO } from 'services/cv'

export const categoryNames = {
  Performance: 'Performance',
  Errors: 'Errors',
  Infrastructure: 'Infrastructure'
}

export function categoryNameToCategoryType(categoryName: string): TimeSeriesMetricDataDTO['category'] {
  switch (categoryName) {
    case categoryNames.Performance:
      return 'PERFORMANCE'
    case categoryNames.Errors:
      return 'ERRORS'
    case categoryNames.Infrastructure:
      return 'INFRASTRUCTURE'
  }
}
