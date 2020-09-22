import type { TimeSeriesMetricDataDTO } from 'services/cv'
import i18n from './CVServicesPage.i18n'

export const MetricPackCategoryLabels = {
  PERFORMANCE: i18n.categoryNameLabels.performance,
  QUALITY: i18n.categoryNameLabels.quality,
  RESOURCES: i18n.categoryNameLabels.resources
}

export function categoryNameToCategoryType(categoryName: string): TimeSeriesMetricDataDTO['category'] {
  switch (categoryName) {
    case MetricPackCategoryLabels.PERFORMANCE:
      return 'PERFORMANCE'
    case MetricPackCategoryLabels.QUALITY:
      return 'QUALITY'
    case MetricPackCategoryLabels.RESOURCES:
      return 'RESOURCES'
  }
}
