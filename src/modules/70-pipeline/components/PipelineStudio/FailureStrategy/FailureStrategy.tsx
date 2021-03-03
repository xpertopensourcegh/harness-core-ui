import React from 'react'
import { Classes } from '@blueprintjs/core'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { debounce } from 'lodash-es'

import type { FailureStrategyConfig, StageElementWrapperConfig } from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import FailureStrategyPanel from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/FailureStrategyPanel'
import {
  ErrorType,
  Strategy
} from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/StrategySelection/StrategyConfig'

import { getFailureStrategiesValidationSchema } from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/validation'
import { Modes } from '@pipeline/components/PipelineSteps/AdvancedSteps/common'

export interface FailureStrategyProps {
  selectedStage?: StageElementWrapperConfig
  onUpdate(data: { failureStrategies: FailureStrategyConfig[] }): void
}

export default function FailureStrategy(props: FailureStrategyProps): React.ReactElement {
  const { getString } = useStrings()
  const { selectedStage, onUpdate } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = React.useCallback(debounce(onUpdate, 300), [onUpdate])

  return (
    <Formik
      initialValues={{
        failureStrategies: selectedStage?.stage?.failureStrategies || [
          {
            onFailure: {
              errors: [ErrorType.AnyOther],
              action: {
                type: Strategy.StageRollback
              }
            }
          }
        ]
      }}
      validationSchema={Yup.object().shape({
        failureStrategies: getFailureStrategiesValidationSchema(getString).required().min(1)
      })}
      onSubmit={onUpdate}
      validate={debouncedUpdate}
    >
      {formik => (
        <div className={Classes.DIALOG_BODY}>
          <FailureStrategyPanel mode={Modes.STAGE} formikProps={formik} />
        </div>
      )}
    </Formik>
  )
}
