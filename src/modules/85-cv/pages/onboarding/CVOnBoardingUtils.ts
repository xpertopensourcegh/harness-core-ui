import type { ConnectorRequestBody } from 'services/cd-ng'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'

export function buildConnectorRef(
  data?: ConnectorRequestBody
): { label: string; scope: string; value: string } | undefined {
  if (!data?.connector) {
    return
  }
  const scope = getScopeFromDTO(data.connector)
  return {
    label: data.connector.name,
    scope,
    value: scope === Scope.PROJECT ? data.connector.identifier : `${scope}.${data.connector.identifier}`
  }
}
