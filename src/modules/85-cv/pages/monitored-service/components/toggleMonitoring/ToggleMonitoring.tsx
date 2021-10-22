import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useToaster } from '@common/exports'
import { useStrings } from 'framework/strings'
import type { RestResponseHealthMonitoringFlagResponse } from 'services/cv'
import ToggleOnOff from '@common/components/ToggleOnOff/ToggleOnOff'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import type { setHealthMonitoringFlagType } from '../../CVMonitoredService/CVMonitoredService.types'

export default function ToggleMonitoring({
  identifier,
  enabled,
  refetch,
  setHealthMonitoringFlag,
  loading
}: {
  identifier: string
  enabled: boolean
  refetch: () => void
  setHealthMonitoringFlag: setHealthMonitoringFlagType
  loading?: boolean
}): JSX.Element {
  const params = useParams<ProjectPathProps>()
  const { showError, showSuccess, clear } = useToaster()
  const { getString } = useStrings()

  const onToggleMonitoringSource = useCallback(
    async (checked: boolean, _identifier: string): Promise<void> => {
      try {
        const output: RestResponseHealthMonitoringFlagResponse = await setHealthMonitoringFlag(undefined, {
          pathParams: {
            identifier: _identifier
          },
          queryParams: {
            enable: checked,
            accountId: params.accountId,
            projectIdentifier: params.projectIdentifier,
            orgIdentifier: params.orgIdentifier
          }
        })
        if (output) {
          refetch()
          showSuccess(
            getString('cv.monitoredServices.monitoredServiceToggle', {
              enabled: output.resource?.healthMonitoringEnabled ? 'enabled' : 'disabled'
            })
          )
        }
      } catch (err) {
        clear()
        showError(getErrorMessage(err))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <ToggleOnOff
      checked={enabled}
      onChange={checked => {
        onToggleMonitoringSource(checked, identifier)
      }}
      loading={loading}
    />
  )
}
