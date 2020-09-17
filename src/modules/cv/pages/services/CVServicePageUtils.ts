import type { TimeSeriesMetricDataDTO } from 'services/cv'
import i18n from './CVServicesPage.i18n'

export const CategoryLabels = {
  PERFORMANCE: i18n.categoryNameLabels.performance,
  QUALITY: i18n.categoryNameLabels.quality,
  RESOURCES: i18n.categoryNameLabels.resources
}

export function categoryNameToCategoryType(categoryName: string): TimeSeriesMetricDataDTO['category'] {
  switch (categoryName) {
    case CategoryLabels.PERFORMANCE:
      return 'PERFORMANCE'
    case CategoryLabels.QUALITY:
      return 'QUALITY'
    case CategoryLabels.RESOURCES:
      return 'RESOURCES'
  }
}
