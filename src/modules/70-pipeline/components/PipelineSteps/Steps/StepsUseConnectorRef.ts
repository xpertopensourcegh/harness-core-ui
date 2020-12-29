import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uikit'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import type { MultiTypeConnectorRef } from './StepsTypes'

interface UseConnectorRefReturnType {
  connector: MultiTypeConnectorRef
  loading: boolean
}

export function useConnectorRef(connectorRef: string): UseConnectorRefReturnType {
  const [connectorToReturn, setConnectorToReturn] = useState<MultiTypeConnectorRef>(connectorRef)

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const connectorId = getIdentifierFromValue(connectorRef)
  const connectorInitialScope = getScopeFromValue(connectorRef)
  const { data: connector, loading, refetch } = useGetConnector({
    identifier: connectorId,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier:
        connectorInitialScope === Scope.ORG || connectorInitialScope === Scope.PROJECT ? orgIdentifier : undefined,
      projectIdentifier: connectorInitialScope === Scope.PROJECT ? projectIdentifier : undefined
    },
    lazy: true,
    debounce: 300
  })

  useEffect(() => {
    if (!isEmpty(connectorRef) && getMultiTypeFromValue(connectorRef) === MultiTypeInputType.FIXED) {
      refetch()
    }
  }, [connectorRef])

  useEffect(() => {
    if (connector?.data?.connector && getMultiTypeFromValue(connectorRef) === MultiTypeInputType.FIXED) {
      const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
      setConnectorToReturn({
        label: connector?.data?.connector.name || '',
        value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
        scope: scope
      })
    } else {
      // Do not apply if we are loading connectors (this will keep "Loading" as placeholder in a input field)
      if (!loading && connectorRef !== connectorToReturn) {
        setConnectorToReturn(connectorRef)
      }
    }
  }, [connectorRef, loading])

  return { connector: connectorToReturn as MultiTypeConnectorRef, loading }
}
