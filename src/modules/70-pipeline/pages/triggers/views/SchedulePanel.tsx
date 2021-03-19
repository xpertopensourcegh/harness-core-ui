import React, { useEffect } from 'react'
import { Layout, Tabs, Tab } from '@wings-software/uicore'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import { MinutesTab, HourlyTab, DailyTab, WeeklyTab, MonthlyTab, YearlyTab, CustomTab } from './subviews'
import { defaultScheduleValues, scheduleTabsId, resetScheduleObject } from './subviews/ScheduleUtils'
import css from './SchedulePanel.module.scss'
interface SchedulePanelPropsInterface {
  formikProps?: any
  isEdit?: boolean
}

const getDefaultValues = (tabId: string) => {
  if (tabId === scheduleTabsId.MINUTES) {
    return { ...resetScheduleObject, minutes: defaultScheduleValues.MINUTES }
  } else if (tabId === scheduleTabsId.CUSTOM) {
    return { ...resetScheduleObject, expression: defaultScheduleValues.CUSTOM }
  }
  return {}
}

const SchedulePanel: React.FC<SchedulePanelPropsInterface> = ({
  formikProps: {
    values: { selectedScheduleTab },
    values
  },
  formikProps
  // isEdit = false
}): JSX.Element => {
  const { getString } = useStrings()

  useEffect(() => {
    if (selectedScheduleTab) {
      formikProps.setValues({ ...values, ...getDefaultValues(selectedScheduleTab) })
    }
  }, [selectedScheduleTab])

  return (
    <Layout.Vertical className={cx(css.schedulePanelContainer)} spacing="large" padding="xxlarge">
      <h2 className={css.heading}>{getString('pipeline-triggers.schedulePanel.title')}</h2>
      <Tabs
        id="Wizard"
        onChange={val => formikProps.setFieldValue('selectedScheduleTab', val)}
        defaultSelectedTabId={selectedScheduleTab}
      >
        <Tab
          id={scheduleTabsId.MINUTES}
          title={getString('pipeline-triggers.schedulePanel.minutesLabel')}
          panel={<MinutesTab formikProps={formikProps} />}
        />
        <Tab
          id={scheduleTabsId.HOURLY}
          title={getString('pipeline-triggers.schedulePanel.hourlyTabTitle')}
          panel={<HourlyTab formikProps={formikProps} />}
        />
        <Tab
          id={scheduleTabsId.DAILY}
          title={getString('pipeline-triggers.schedulePanel.dailyTabTitle')}
          panel={<DailyTab formikProps={formikProps} />}
        />
        <Tab
          id={scheduleTabsId.WEEKLY}
          title={getString('pipeline-triggers.schedulePanel.weeklyTabTitle')}
          panel={<WeeklyTab formikProps={formikProps} />}
        />
        <Tab
          id={scheduleTabsId.MONTHLY}
          title={getString('pipeline-triggers.schedulePanel.monthlyTabTitle')}
          panel={<MonthlyTab formikProps={formikProps} />}
        />
        <Tab
          id={scheduleTabsId.YEARLY}
          title={getString('pipeline-triggers.schedulePanel.yearlyTabTitle')}
          panel={<YearlyTab formikProps={formikProps} />}
        />
        <Tab
          id={scheduleTabsId.CUSTOM}
          title={getString('repo-provider.customLabel')}
          panel={<CustomTab formikProps={formikProps} />}
        />
      </Tabs>
    </Layout.Vertical>
  )
}
export default SchedulePanel
