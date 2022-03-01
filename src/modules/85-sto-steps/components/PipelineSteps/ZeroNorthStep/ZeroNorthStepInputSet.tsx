/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, FormikForm } from '@wings-software/uicore'
import StepCommonFieldsInputSet from '@ci/components/PipelineSteps/StepCommonFields/StepCommonFieldsInputSet'
import { CIStep } from '@ci/components/PipelineSteps/CIStep/CIStep'
import { CIStepOptionalConfig } from '@ci/components/PipelineSteps/CIStep/CIStepOptionalConfig'
import type { ZeroNorthStepProps } from './ZeroNorthStep'
import css from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export const ZeroNorthStepInputSet: React.FC<ZeroNorthStepProps> = ({
  template,
  path,
  readonly,
  stepViewType,
  allowableTypes
}) => {
  return (
    <FormikForm className={css.removeBpPopoverWrapperTopMargin}>
      <CIStep
        readonly={readonly}
        stepViewType={stepViewType}
        allowableTypes={allowableTypes}
        enableFields={{
          ...(getMultiTypeFromValue(template?.description) === MultiTypeInputType.RUNTIME && {
            description: {}
          })
        }}
        path={path || ''}
      />
      <CIStepOptionalConfig
        readonly={readonly}
        enableFields={{
          ...(getMultiTypeFromValue(template?.spec?.settings as string) === MultiTypeInputType.RUNTIME && {
            'spec.settings': {}
          })
        }}
        allowableTypes={allowableTypes}
        stepViewType={stepViewType}
        path={path || ''}
      />
      <StepCommonFieldsInputSet
        path={path}
        readonly={readonly}
        template={template}
        allowableTypes={allowableTypes}
        stepViewType={stepViewType}
      />
    </FormikForm>
  )
}
