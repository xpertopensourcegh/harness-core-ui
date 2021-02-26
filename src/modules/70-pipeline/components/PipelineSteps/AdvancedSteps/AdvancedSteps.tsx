import React from 'react'
import type { FormikProps } from 'formik'
import { Formik, FormikForm, Accordion } from '@wings-software/uicore'
import * as Yup from 'yup'

import { useStrings } from 'framework/exports'
import {
  AdvancedPanels,
  StepCommandsProps,
  Values
} from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import { TabTypes } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import { StepFormikFowardRef, setFormikRef } from '@pipeline/components/AbstractSteps/Step'

import PreRequisitesPanel from './PreRequisitesPanel/PreRequisitesPanel'
import SkipConditionsPanel from './SkipConditionsPanel/SkipConditionsPanel'
import FailureStrategyPanel from './FailureStrategyPanel/FailureStrategyPanel'
import { getFailureStrategiesValidationSchema } from './FailureStrategyPanel/validation'
import { Modes } from './common'
import css from './AdvancedSteps.module.scss'

export interface AdvancedStepsProps extends StepCommandsProps {
  _?: unknown // to void empty interface error
}

export default function AdvancedSteps(props: AdvancedStepsProps, formikRef: StepFormikFowardRef): React.ReactElement {
  const { step, onChange, hiddenPanels = [], hasStepGroupAncestor, isStepGroup } = props
  const { getString } = useStrings()

  return (
    <Formik
      initialValues={{ skipCondition: step.skipCondition, failureStrategies: step.failureStrategies }}
      onSubmit={data => {
        onChange({ ...data, tab: TabTypes.Advanced })
      }}
      validationSchema={Yup.object().shape({
        failureStrategies: getFailureStrategiesValidationSchema(getString)
      })}
    >
      {(formikProps: FormikProps<Values>) => {
        setFormikRef(formikRef, formikProps)

        return (
          <FormikForm className={css.form}>
            <div>
              <Accordion activeId={AdvancedPanels.SkipCondition}>
                {hiddenPanels.indexOf(AdvancedPanels.PreRequisites) === -1 && (
                  <Accordion.Panel
                    id={AdvancedPanels.PreRequisites}
                    summary={getString('preRequisitesTitle')}
                    details={<PreRequisitesPanel />}
                  />
                )}
                {hiddenPanels.indexOf(AdvancedPanels.SkipCondition) === -1 && (
                  <Accordion.Panel
                    id={AdvancedPanels.SkipCondition}
                    summary={getString('skipConditionsTitle')}
                    details={<SkipConditionsPanel />}
                  />
                )}
                {hiddenPanels.indexOf(AdvancedPanels.FailureStrategy) === -1 && (
                  <Accordion.Panel
                    id={AdvancedPanels.FailureStrategy}
                    summary={getString('failureStrategy.title')}
                    details={
                      <FailureStrategyPanel
                        mode={hasStepGroupAncestor || isStepGroup ? Modes.STEP_GROUP : Modes.STEP}
                        formikProps={formikProps}
                      />
                    }
                  />
                )}
              </Accordion>
            </div>
          </FormikForm>
        )
      }}
    </Formik>
  )
}

export const AdvancedStepsWithRef = React.forwardRef(AdvancedSteps)
