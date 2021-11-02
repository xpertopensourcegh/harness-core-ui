import type { ServiceLevelIndicatorDTO, ServiceLevelObjectiveDTO } from 'services/cv'
import type { SLOForm } from './CreateSLO.types'

export const createSLORequestPayload = (
  values: SLOForm,
  orgIdentifier: string,
  projectIdentifier: string
): ServiceLevelObjectiveDTO => {
  const {
    serviceLevelIndicators: { type = '', spec = {} }
  } = values

  return {
    ...values,
    orgIdentifier,
    projectIdentifier,
    serviceLevelIndicators: [{ type, spec }] as ServiceLevelIndicatorDTO[]
  }
}
