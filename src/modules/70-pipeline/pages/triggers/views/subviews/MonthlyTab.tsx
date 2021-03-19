import React from 'react'
import { Layout } from '@wings-software/uicore'
import { Toothpick, TimeSelect } from '@common/components'
import { useStrings } from 'framework/exports'
import ExpressionBreakdown, { ActiveInputs } from './ExpressionBreakdown'
import Expression from './Expression'
import Spacer from './Spacer'
import { oneTwelveOptions, nthDayOptions } from './ScheduleUtils'
import css from './MonthlyTab.module.scss'

interface MonthlyTabInterface {
  formikProps: any
}

export default function MonthlyTab(props: MonthlyTabInterface): JSX.Element {
  const {
    formikProps: {
      values: { nthDay, numMonths, minutes, hours, amPm },
      values
    },
    formikProps
  } = props
  const { getString } = useStrings()

  // useEffect(() => {
  //   formikProps.setValues({
  //     nthDay: defaultValues.NTH_DAY,
  //     numMonths: defaultValues.NUM_MONTHS,
  //     hours: defaultValues.HOURS,
  //     minutes: defaultValues.MINUTES,
  //     amPm: defaultValues.AM_PM
  //   })
  // }, [])

  return (
    <div className={css.monthlyTab}>
      <Layout.Vertical>
        <Toothpick
          label={getString('pipeline-triggers.schedulePanel.runOnSpecificDay')}
          startValue={nthDay}
          handleStartValueChange={val => formikProps.setFieldValue('day', val)}
          endValue={numMonths}
          handleEndValueChange={val => formikProps.setFieldValue('month', val)}
          startOptions={nthDayOptions}
          endOptions={oneTwelveOptions}
          adjoiningText={getString('pipeline-triggers.schedulePanel.ofEvery')}
          endingText={getString('pipeline-triggers.schedulePanel.monthsParentheses')}
        />
        <TimeSelect
          label={getString('pipeline-triggers.schedulePanel.runAt')}
          hoursValue={hours}
          minutesValue={minutes}
          amPmValue={amPm}
          handleHoursSelect={option => formikProps.setFieldValue('hours', option)}
          handleMinutesSelect={option => formikProps.setFieldValue('minutes', option)}
          handleAmPmSelect={option => formikProps.setFieldValue('amPm', option)}
          hideSeconds={true}
        />
        <Spacer paddingTop="var(--spacing-large)" />
        <ExpressionBreakdown
          formikValues={values}
          activeInputs={[ActiveInputs.MINUTES, ActiveInputs.HOURS, ActiveInputs.DAY_OF_MONTH, ActiveInputs.MONTH]}
        />
        <Spacer />
        <Expression formikProps={formikProps} />
      </Layout.Vertical>
    </div>
  )
}
