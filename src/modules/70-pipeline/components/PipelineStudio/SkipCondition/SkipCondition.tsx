import React from 'react'
import { Classes, H4 } from '@blueprintjs/core'
import { Formik } from 'formik'
import { Button } from '@wings-software/uicore'

import { useStrings } from 'framework/exports'

import SkipConditionsPanel from '@pipeline/components/PipelineSteps/AdvancedSteps/SkipConditionsPanel/SkipConditionsPanel'
import { Modes } from '@pipeline/components/PipelineSteps/AdvancedSteps/common'

/*
Formik blanket over SkipConditionsPanel - with validationschema and submit button
SkipConditionsPanel is the original form - used in stage/steps and step groups.
This file will be used for stage level skip conditions, hence passing the mode = STAGE
*/
export interface SkipConditionProps {
  selectedStage: any
  onUpdate(data: { skipCondition: string }): void
}

export default function SkipCondition(props: SkipConditionProps): React.ReactElement {
  const { getString } = useStrings()
  const {
    selectedStage: { stage },
    onUpdate
  } = props

  return (
    <Formik
      initialValues={{
        skipCondition: stage.skipCondition || ''
      }}
      onSubmit={onUpdate}
    >
      {formik => {
        return (
          <React.Fragment>
            <div className={Classes.DRAWER_HEADER}>
              <H4>
                {getString('stageName', stage)} / {getString('skipConditionTitle')}
              </H4>
            </div>
            <div className={Classes.DRAWER_BODY}>
              <div className={Classes.DIALOG_BODY}>
                <SkipConditionsPanel mode={Modes.STAGE} />
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
