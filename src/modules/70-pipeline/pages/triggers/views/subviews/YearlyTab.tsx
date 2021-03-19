import React from 'react'
import { Layout } from '@wings-software/uicore'
import { Toothpick, TimeSelect } from '@common/components'
import { useStrings } from 'framework/exports'
import ExpressionBreakdown, { ActiveInputs } from './ExpressionBreakdown'
import Expression from './Expression'
import Spacer from './Spacer'
import { monthOptions, nthDayOptions } from './ScheduleUtils'
import css from './YearlyTab.module.scss'

interface YearlyTabInterface {
  formikProps: any
}

export default function YearlyTab(props: YearlyTabInterface): JSX.Element {
  const {
    formikProps: {
      values: { nthDay, months, minutes, hours, amPm },
      values
    },
    formikProps
  } = props
  const { getString } = useStrings()

  // useEffect(() => {
  //   formikProps.setValues({
  //     nthDay: defaultValues.NTH_DAY,
  //     months: defaultValues.MONTH,
  //     hours: defaultValues.HOURS,
  //     minutes: defaultValues.MINUTES,
  //     amPm: defaultValues.AM_PM
  //   })
  // }, [])

  return (
    <div className={css.yearlyTab}>
      <Layout.Vertical>
        <Toothpick
          label={getString('pipeline-triggers.schedulePanel.runOnSpecificDayMonth')}
          startValue={months}
          handleStartValueChange={val => formikProps.setFieldValue('day', val)}
          endValue={nthDay}
          handleEndValueChange={val => formikProps.setFieldValue('month', val)}
          startOptions={monthOptions}
          endOptions={nthDayOptions}
          adjoiningText={getString('pipeline-triggers.schedulePanel.onThe')}
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
