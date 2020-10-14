import type { TimeSeriesMetricDataDTO } from 'services/cv'
import i18n from './CVServicesPage.i18n'

export const MetricPackCategoryLabels = {
  PERFORMANCE: i18n.categoryNameLabels.performance,
  ERRORS: i18n.categoryNameLabels.quality,
  RESOURCES: i18n.categoryNameLabels.resources
}

export function categoryNameToCategoryType(categoryName: string): TimeSeriesMetricDataDTO['category'] {
  switch (categoryName) {
    case MetricPackCategoryLabels.PERFORMANCE:
      return 'PERFORMANCE'
    case MetricPackCategoryLabels.ERRORS:
      return 'ERRORS'
    case MetricPackCategoryLabels.RESOURCES:
      return 'RESOURCES'
  }
}
