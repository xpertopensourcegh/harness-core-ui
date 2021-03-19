import type { SelectOption } from '@wings-software/uicore'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import type { DSConfig, MetricPackDTO } from 'services/cv'
import type { Scope } from '@common/interfaces/SecretsInterface'

export const NewRelicProductNames = {
  APM: 'apm'
}

export type NewRelicServiceEnvMapping = {
  service: SelectOption
  environment: SelectOption
  applicationId: number
  applicationName: string
}
export interface NewRelicSetupSource extends DSConfig {
  mappedServicesAndEnvs: Map<number, NewRelicServiceEnvMapping> // applicationId is the key
  connectorRef?: {
    label: string
    scope: Scope
    value: string
  }
  selectedMetricPacks?: MetricPackDTO[]
}

export function buildDefaultNewRelicMonitoringSource({
  orgIdentifier,
  projectIdentifier,
  accountId
}: ProjectPathProps): NewRelicSetupSource {
  return {
    monitoringSourceName: `MyNewRelicSource${orgIdentifier}-${projectIdentifier}`,
    accountId,
    orgIdentifier,
    projectIdentifier,
    productName: NewRelicProductNames.APM,
    identifier: `MyNewRelicSource${orgIdentifier}-${projectIdentifier}`,
    type: 'NEW_RELIC',
    mappedServicesAndEnvs: new Map()
  }
}
