import React from 'react'
import { Classes, H4 } from '@blueprintjs/core'
import { Formik } from 'formik'
import { Button } from '@wings-software/uicore'

import { useStrings } from 'framework/exports'
import FailureStrategyPanel from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/FailureStrategyPanel'
import {
  ErrorType,
  FailureStrategyPanelMode
} from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/StrategySelection/StrategyConfig'

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

  return (
    <Formik
      initialValues={{
        failureStrategies: stage.failureStrategies || [{ onFailure: { errors: [ErrorType.AnyOther] } }]
      }}
      onSubmit={onUpdate}
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
                <FailureStrategyPanel mode={FailureStrategyPanelMode.STAGE} formikProps={formik} />
              </div>
            </div>
            <div className={Classes.DRAWER_FOOTER}>
              <Button intent="primary" onClick={formik.submitForm}>
                {getString('submit')}
              </Button>
            </div>
          </React.Fragment>
        )
      }}
    </Formik>
  )
}
