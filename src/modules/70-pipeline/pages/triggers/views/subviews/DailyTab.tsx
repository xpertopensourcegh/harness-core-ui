import React, { useState, useEffect } from 'react'
import { FormInput, Text, Container, Color, Layout, Icon, Button } from '@wings-software/uicore'
import cx from 'classnames'
import { TimeSelect } from '@common/components'
import { useStrings } from 'framework/exports'
// import { amPmOptions } from '@common/components/TimeSelect/TimeSelectUtils'
import ExpressionBreakdown, { ActiveInputs } from './ExpressionBreakdown'
import Expression from './Expression'
import Spacer from './Spacer'
import { oneThirtyOneOptions, defaultScheduleValues } from './ScheduleUtils'
import css from './DailyTab.module.scss'

enum DailyTypes {
  NTH_DAYS = 'NTH_DAYS',
  EVERY_WEEK_DAY = 'EVERY_WEEK_DAY'
}
interface DailyTabInterface {
  formikProps: any
}

// const defaultValues = {
//   DAYS: oneThirtyOneOptions[0].value,
//   HOURS: oneTwelveDDOptions[0],
//   MINUTES: zeroFiftyNineDDOptions[0],
//   AM_PM: amPmOptions[0]
// }

export default function DailyTab(props: DailyTabInterface): JSX.Element {
  const [dailyType, setDailyType] = useState<DailyTypes>(DailyTypes.NTH_DAYS)
  const {
    formikProps: {
      values: { minutes, hours, amPm },
      values
    },
    formikProps
  } = props
  const { getString } = useStrings()

  useEffect(() => {
    formikProps.setValues({
      ...values,
      days: defaultScheduleValues.DAYS,
      hours: defaultScheduleValues.HOURS.value,
      minutes: defaultScheduleValues.MINUTES,
      amPm: defaultScheduleValues.AM_PM.value
    })
  }, [])

  return (
    <div className={css.dailyTab}>
      <Layout.Vertical style={{ alignItems: 'flex-start' }}>
        <Container
          className={cx(css.radioContainer, dailyType === DailyTypes.NTH_DAYS ? css.activeRadio : css.inactiveRadio)}
        >
          <Button minimal onClick={() => setDailyType(DailyTypes.NTH_DAYS)}>
            <Layout.Horizontal spacing="medium">
              <Icon name={dailyType === DailyTypes.NTH_DAYS ? 'selection' : 'circle'} />
              <Text className={css.radioOption}>{getString('pipeline-triggers.schedulePanel.runEvery')}</Text>
            </Layout.Horizontal>
          </Button>
          <Layout.Horizontal className={css.everyContainer} spacing="medium">
            <FormInput.Select
              name="days"
              items={oneThirtyOneOptions}
              disabled={dailyType !== DailyTypes.NTH_DAYS}
              placeholder="Select"
            />
            <Text style={{ marginBottom: 'var(--spacing-medium)' }} color={Color.GREY_800}>
              {getString('pipeline-triggers.schedulePanel.daysParentheses')}
            </Text>
          </Layout.Horizontal>
          <TimeSelect
            label={getString('pipeline-triggers.schedulePanel.runAt')}
            className={css.everyContainer}
            disabled={dailyType !== DailyTypes.NTH_DAYS}
            hoursValue={(dailyType === DailyTypes.NTH_DAYS && hours) || defaultScheduleValues.HOURS}
            minutesValue={(dailyType === DailyTypes.NTH_DAYS && minutes) || defaultScheduleValues.MINUTES}
            amPmValue={(dailyType === DailyTypes.NTH_DAYS && amPm) || defaultScheduleValues.AM_PM}
            handleHoursSelect={option => formikProps.setFieldValue('hours', option)}
            handleMinutesSelect={option => formikProps.setFieldValue('minutes', option)}
            handleAmPmSelect={option => formikProps.setFieldValue('amPm', option)}
            hideSeconds={true}
          />
        </Container>
        <Container
          style={{ paddingTop: 'var(--spacing-small)' }}
          className={cx(
            css.radioContainer,
            dailyType === DailyTypes.EVERY_WEEK_DAY ? css.activeRadio : css.inactiveRadio
          )}
        >
          <Button minimal onClick={() => setDailyType(DailyTypes.EVERY_WEEK_DAY)}>
            <Layout.Horizontal>
              <Icon
                style={{ marginRight: 'var(--spacing-medium)' }}
                name={dailyType === DailyTypes.EVERY_WEEK_DAY ? 'selection' : 'circle'}
              />
              <>
                <Text className={css.radioOption} style={{ marginRight: 'var(--spacing-xsmall)' }}>
                  {getString('pipeline-triggers.schedulePanel.runEveryWeekday')}
                </Text>
                <Text>{getString('pipeline-triggers.schedulePanel.mondayToFridayParentheses')}</Text>
              </>
            </Layout.Horizontal>
          </Button>
          <TimeSelect
            label={getString('pipeline-triggers.schedulePanel.runAt')}
            className={css.everyContainer}
            disabled={dailyType === DailyTypes.NTH_DAYS}
            hoursValue={(dailyType !== DailyTypes.NTH_DAYS && hours) || defaultScheduleValues.HOURS}
            minutesValue={(dailyType !== DailyTypes.NTH_DAYS && minutes) || defaultScheduleValues.MINUTES}
            amPmValue={(dailyType !== DailyTypes.NTH_DAYS && amPm) || defaultScheduleValues.AM_PM}
            handleHoursSelect={option => formikProps.setFieldValue('hours', option)}
            handleMinutesSelect={option => formikProps.setFieldValue('minutes', option)}
            handleAmPmSelect={option => formikProps.setFieldValue('amPm', option)}
            hideSeconds={true}
          />
        </Container>
        <Spacer paddingBottom="var(--spacing-large)" />
        <ExpressionBreakdown
          formikValues={values}
          activeInputs={[ActiveInputs.MINUTES, ActiveInputs.HOURS, ActiveInputs.DAY_OF_MONTH, ActiveInputs.DAY_OF_WEEK]}
        />
        <Spacer paddingTop="var(--spacing-large)" />
        <Expression formikProps={formikProps} />
      </Layout.Vertical>
    </div>
  )
}
