import type { ResponsePageServiceLevelObjectiveResponse } from 'services/cv'
import type { SLOForm } from './components/CreateSLOForm/CreateSLO.types'

export const getSLOsData = (SLOsData: ResponsePageServiceLevelObjectiveResponse | null): SLOForm[] => {
  return (SLOsData?.data?.content?.map(slo => {
    const { type, spec } = slo?.serviceLevelObjective?.serviceLevelIndicators?.[0] || {}
    return {
      ...slo?.serviceLevelObjective,
      serviceLevelIndicators: {
        type,
        spec
      }
    }
  }) || []) as SLOForm[]
}
