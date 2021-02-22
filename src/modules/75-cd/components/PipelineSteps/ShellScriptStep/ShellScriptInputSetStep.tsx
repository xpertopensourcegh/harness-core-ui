import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, FormInput, FormikForm } from '@wings-software/uicore'
import { FormGroup } from '@blueprintjs/core'
import { isEmpty } from 'lodash-es'
import { useStrings } from 'framework/exports'
import type { StepViewType } from '@pipeline/exports'
import MultiTypeSecretInput from '@secrets/components/MutiTypeSecretInput/MultiTypeSecretInput'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { ShellScriptData, ShellScriptFormData } from './shellScriptTypes'

export interface ShellScriptInputSetStepProps {
  initialValues: ShellScriptFormData
  onUpdate?: (data: ShellScriptFormData) => void
  stepViewType?: StepViewType
  readonly?: boolean
  template?: ShellScriptData
  path?: string
}

export default function ShellScriptInputSetStep(props: ShellScriptInputSetStepProps): React.ReactElement {
  const { template, path, readonly } = props
  const { getString } = useStrings()

  return (
    <FormikForm>
      {getMultiTypeFromValue(template?.spec?.source?.spec?.script) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('script')}>
          <FormInput.Text disabled={readonly} name={`${isEmpty(path) ? '' : `${path}.`}spec.source.spec.script`} />
        </FormGroup>
      ) : null}

      {getMultiTypeFromValue(template?.spec?.executionTarget?.host) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('targetHost')}>
          <FormInput.Text disabled={readonly} name={`${isEmpty(path) ? '' : `${path}.`}spec.executionTarget.host`} />
        </FormGroup>
      ) : null}

      {getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME && (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${isEmpty(path) ? '' : `${path}.`}timeout`}
          disabled={readonly}
        />
      )}

      {getMultiTypeFromValue(template?.spec?.executionTarget?.connectorRef) === MultiTypeInputType.RUNTIME && (
        <MultiTypeSecretInput
          type="SSHKey"
          name={`${isEmpty(path) ? '' : `${path}.`}spec.executionTarget.connectorRef`}
          label={getString('sshConnector')}
          disabled={readonly}
        />
      )}

      {getMultiTypeFromValue(template?.spec?.executionTarget?.workingDirectory) === MultiTypeInputType.RUNTIME ? (
        <FormGroup label={getString('workingDirectory')}>
          <FormInput.Text
            disabled={readonly}
            name={`${isEmpty(path) ? '' : `${path}.`}spec.executionTarget.workingDirectory`}
          />
        </FormGroup>
      ) : null}
    </FormikForm>
  )
}
