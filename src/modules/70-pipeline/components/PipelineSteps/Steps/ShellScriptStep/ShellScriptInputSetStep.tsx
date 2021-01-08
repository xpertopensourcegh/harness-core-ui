import React from 'react'
import { Text, getMultiTypeFromValue, MultiTypeInputType, FormInput, FormikForm } from '@wings-software/uicore'
import { FormGroup } from '@blueprintjs/core'

import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { useStrings } from 'framework/exports'
import type { StepViewType } from '@pipeline/exports'

import { ConnectorReferenceField } from '@connectors/components/ConnectorReferenceField/ConnectorReferenceField'
import { Scope } from '@common/interfaces/SecretsInterface'
import type { ShellScriptData, ShellScriptFormData } from './shellScriptTypes'
import { useConnectorRef } from '../StepsUseConnectorRef'
import type { ConnectorRef } from '../StepsTypes'

export interface ShellScriptInputSetStepProps {
  initialValues: ShellScriptFormData
  onUpdate?: (data: ShellScriptFormData) => void
  stepViewType?: StepViewType
  readonly?: boolean
  template?: ShellScriptData
  path?: string
}

export default function ShellScriptInputSetStep(props: ShellScriptInputSetStepProps): React.ReactElement {
  const { template, onUpdate, initialValues, path } = props
  const { getString } = useStrings()

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const { connector, loading } = useConnectorRef(initialValues?.spec?.executionTarget?.connectorRef || '')

  return (
    <FormikForm>
      {getMultiTypeFromValue(template?.spec?.source?.spec?.script) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('script')}>
          <FormInput.Text name={`${isEmpty(path) ? '' : `${path}.`}spec.source.spec.script`} />
        </FormGroup>
      ) : null}

      {getMultiTypeFromValue(template?.spec?.executionTarget?.host) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('targetHost')}>
          <FormInput.Text name={`${isEmpty(path) ? '' : `${path}.`}spec.executionTarget.host`} />
        </FormGroup>
      ) : null}

      {getMultiTypeFromValue(template?.spec?.executionTarget?.connectorRef) === MultiTypeInputType.RUNTIME && (
        <ConnectorReferenceField
          label={<Text style={{ display: 'flex', alignItems: 'center' }}>{getString('sshConnector')}</Text>}
          accountIdentifier={accountId}
          selected={connector as ConnectorRef}
          projectIdentifier={projectIdentifier}
          orgIdentifier={orgIdentifier}
          width={560}
          name={`${isEmpty(path) ? '' : `${path}.`}spec.executionTarget.connectorRef`}
          placeholder={loading ? getString('loading') : getString('select')}
          disabled={loading}
          onChange={(record, scope) => {
            onUpdate?.({
              ...initialValues,
              spec: {
                ...initialValues.spec,
                executionTarget: {
                  ...initialValues.spec.executionTarget,
                  connectorRef:
                    scope === Scope.ORG || scope === Scope.PROJECT
                      ? `${scope}.${record?.identifier}`
                      : record?.identifier
                }
              }
            })
          }}
        />
      )}

      {getMultiTypeFromValue(template?.spec?.executionTarget?.workingDirectory) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('workingDirectory')}>
          <FormInput.Text name={`${isEmpty(path) ? '' : `${path}.`}spec.executionTarget.workingDirectory`} />
        </FormGroup>
      ) : null}
    </FormikForm>
  )
}
