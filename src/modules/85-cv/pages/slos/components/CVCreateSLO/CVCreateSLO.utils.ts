import type { RestResponseServiceLevelObjectiveResponse } from 'services/cv'
import type { SLITypeEnum } from './components/CreateSLOForm/components/SLI/SLI.constants'
import { initialValuesSLO } from './components/CreateSLOForm/CreateSLO.constants'
import type { SLOForm } from './components/CreateSLOForm/CreateSLO.types'

export const getInitialValuesSLO = (
  identifier: string,
  SLODataById: RestResponseServiceLevelObjectiveResponse | null
): SLOForm => {
  if (identifier && SLODataById?.resource?.serviceLevelObjective) {
    const { type, spec } = SLODataById?.resource?.serviceLevelObjective.serviceLevelIndicators?.[0] || {}
    return {
      ...SLODataById?.resource?.serviceLevelObjective,
      serviceLevelIndicators: {
        type: type as SLITypeEnum,
        spec
      }
    }
  } else {
    return initialValuesSLO
  }
}
