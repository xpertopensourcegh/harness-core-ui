import React from 'react'
import { Classes, H4 } from '@blueprintjs/core'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { debounce } from 'lodash-es'
import { useStrings } from 'framework/exports'
import FailureStrategyPanel from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/FailureStrategyPanel'
import {
  ErrorType,
  Strategy
} from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/StrategySelection/StrategyConfig'

import { getFailureStrategiesValidationSchema } from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/validation'
import { Modes } from '@pipeline/components/PipelineSteps/AdvancedSteps/common'

export interface FailureStrategyProps {
  selectedStage: any
  onUpdate(data: { failureStrategies: any[] }): void
}

export default function FailureStrategy(props: FailureStrategyProps): React.ReactElement {
  const { getString } = useStrings()
  const {
    selectedStage: { stage },
    onUpdate
  } = props
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = React.useCallback(debounce(onUpdate, 300), [onUpdate])

  return (
    <Formik
      initialValues={{
        failureStrategies: stage.failureStrategies || [
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
      {formik => {
        return (
          <React.Fragment>
            <div className={Classes.DRAWER_HEADER}>
              <H4>
                {getString('stageName', stage)} / {getString('failureStrategy.title')}
              </H4>
            </div>
            <div className={Classes.DRAWER_BODY}>
              <div className={Classes.DIALOG_BODY}>
                <FailureStrategyPanel mode={Modes.STAGE} formikProps={formik} />
              </div>
            </div>
          </React.Fragment>
        )
      }}
    </Formik>
  )
}
