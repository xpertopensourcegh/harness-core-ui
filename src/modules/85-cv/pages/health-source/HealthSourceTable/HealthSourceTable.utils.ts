import { Connectors } from '@connectors/constants'
import type { UseStringsReturn } from 'framework/strings'
import { HealthSourceTypes } from '../types'

export const getTypeByFeature = (feature: string, getString: UseStringsReturn['getString']): string => {
  switch (feature) {
    case Connectors.APP_DYNAMICS:
    case Connectors.GCP:
      return getString('cv.healthSource.table.type.metrics')
    case HealthSourceTypes.StackdriverLog:
      return getString('cv.healthSource.table.type.logs')
    default:
      return ''
  }
}
