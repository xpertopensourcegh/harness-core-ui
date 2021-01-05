import React from 'react'
import type { FormikProps } from 'formik'
import { Formik, FormikForm } from '@wings-software/uicore'
import { debounce } from 'lodash-es'

import { useStrings } from 'framework/exports'
import type { StepCommandsProps, Values } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import { TabTypes } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import Accordion from '@common/components/Accordion/Accordion'

import PreRequisitesPanel from './PreRequisitesPanel/PreRequisitesPanel'
import SkipConditionsPanel from './SkipConditionsPanel/SkipConditionsPanel'
import FailureStrategyPanel from './FailureStrategyPanel/FailureStrategyPanel'
import css from './AdvancedSteps.module.scss'

export interface AdvancedStepsProps extends StepCommandsProps {
  _?: unknown // to void empty interface error
}

export default function AdvancedSteps(props: AdvancedStepsProps): React.ReactElement {
  const { step, onChange } = props
  const handleValidate = (values: Values): void => {
    onChange({ ...values, tab: TabTypes.Advanced, shouldKeepOpen: true })
  }
  const { getString } = useStrings()

  const debouncedHandleValidate = React.useRef(debounce(handleValidate, 300)).current

  return (
    <Formik
      initialValues={{ skipCondition: step.skipCondition, failureStrategies: step.failureStrategies }}
      validate={debouncedHandleValidate}
      onSubmit={() => {
        //
      }}
    >
      {(formikProps: FormikProps<Values>) => {
        return (
          <FormikForm className={css.form}>
            <div>
              <Accordion activeId="failureStrategy">
                <Accordion.Panel
                  id="preRequisites"
                  summary={getString('preRequisitesTitle')}
                  details={<PreRequisitesPanel />}
                />
                <Accordion.Panel
                  id="skipCondition"
                  summary={getString('skipConditionsTitle')}
                  details={<SkipConditionsPanel />}
                />
                <Accordion.Panel
                  id="failureStrategy"
                  summary={getString('failureStrategyTitle')}
                  details={<FailureStrategyPanel formikProps={formikProps} />}
                />
              </Accordion>
            </div>
          </FormikForm>
        )
      }}
    </Formik>
  )
}
