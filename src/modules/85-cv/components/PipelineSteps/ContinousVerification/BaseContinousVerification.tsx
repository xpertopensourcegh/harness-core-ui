import React from 'react'
import cx from 'classnames'
import { FormInput } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export default function BaseContinousVerification(): React.ReactElement {
  const { getString } = useStrings()
  return (
    <>
      <div className={cx(stepCss.formGroup, stepCss.md)}>
        <FormInput.InputWithIdentifier inputLabel={getString('pipelineSteps.stepNameLabel')} />
      </div>
    </>
  )
}
