import React from 'react'
import { FormInput } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import ExpressionBreakdown, { ActiveInputs } from './ExpressionBreakdown'
import Expression from './Expression'
import Spacer from './Spacer'

interface CustomTabInterface {
  formikProps: any
}

export default function CustomTab(props: CustomTabInterface): JSX.Element {
  const {
    formikProps: { values },
    formikProps
  } = props
  const { getString } = useStrings()

  return (
    <>
      <FormInput.Text
        label={getString('pipeline-triggers.schedulePanel.enterCustomCron')}
        name="expression"
        style={{ margin: 0 }}
      />
      <Spacer paddingTop="var(--spacing-large)" />
      <ExpressionBreakdown
        formikValues={values}
        activeInputs={[
          ActiveInputs.MINUTES,
          ActiveInputs.HOURS,
          ActiveInputs.DAY_OF_MONTH,
          ActiveInputs.MONTH,
          ActiveInputs.DAY_OF_WEEK
        ]}
      />
      <Spacer />
      <Expression formikProps={formikProps} />
    </>
  )
}
