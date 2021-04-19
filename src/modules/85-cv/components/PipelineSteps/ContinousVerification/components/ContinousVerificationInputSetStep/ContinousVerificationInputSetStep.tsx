import React from 'react'
import { FormInput, FormikForm } from '@wings-software/uicore'
import { FormGroup } from '@blueprintjs/core'
import { isEmpty } from 'lodash-es'

import { useStrings } from 'framework/exports'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { spec } from '../../types'
import { checkIfRunTimeInput } from '../../utils'
import type { ContinousVerificationProps } from './types'

export function ContinousVerificationInputSetStep(props: ContinousVerificationProps): React.ReactElement {
  const { template, path, readonly } = props
  const { getString } = useStrings()
  const prefix = isEmpty(path) ? '' : `${path}.`
  const { sensitivity, duration, baseline, trafficsplit, deploymentTag } = template?.spec?.spec as spec

  return (
    <FormikForm>
      {checkIfRunTimeInput(sensitivity) && (
        <FormGroup label={getString('sensitivity')}>
          <FormInput.Text disabled={readonly} name={`${prefix}spec.spec.sensitivity`} />
        </FormGroup>
      )}

      {checkIfRunTimeInput(duration) && (
        <FormGroup label={getString('connectors.cdng.duration')}>
          <FormInput.Text disabled={readonly} name={`${prefix}spec.spec.duration`} />
        </FormGroup>
      )}

      {checkIfRunTimeInput(baseline) && (
        <FormGroup label={getString('connectors.cdng.baseline')}>
          <FormInput.Text disabled={readonly} name={`${prefix}spec.spec.baseline`} />
        </FormGroup>
      )}

      {checkIfRunTimeInput(trafficsplit) && (
        <FormGroup label={getString('connectors.cdng.trafficsplit')}>
          <FormInput.Text disabled={readonly} name={`${prefix}spec.spec.trafficsplit`} />
        </FormGroup>
      )}

      {checkIfRunTimeInput(deploymentTag) && (
        <FormGroup label={getString('connectors.cdng.deploymentTag')}>
          <FormInput.Text disabled={readonly} name={`${prefix}spec.spec.deploymentTag`} />
        </FormGroup>
      )}
      {checkIfRunTimeInput(template?.timeout) && (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${prefix}timeout`}
          disabled={readonly}
        />
      )}
    </FormikForm>
  )
}
