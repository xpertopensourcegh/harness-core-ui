import React from 'react'
import { Layout, Container, Text } from '@wings-software/uicore'
import { isUndefined } from 'lodash-es'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import { EXP_BREAKDOWN_INPUTS, scheduleTabsId } from './ScheduleUtils'
import css from './ExpressionBreakdown.module.scss'

interface ExpressionBreakdownPropsInterface {
  formikValues?: any
  activeInputs: EXP_BREAKDOWN_INPUTS[]
}

export const ActiveInputs = {
  MINUTES: EXP_BREAKDOWN_INPUTS.MINUTES,
  HOURS: EXP_BREAKDOWN_INPUTS.HOURS,
  DAY_OF_MONTH: EXP_BREAKDOWN_INPUTS.DAY_OF_MONTH,
  MONTH: EXP_BREAKDOWN_INPUTS.MONTH,
  DAY_OF_WEEK: EXP_BREAKDOWN_INPUTS.DAY_OF_WEEK
}
const ColumnWidth = {
  SMALL: 100,
  MEDIUM: 125,
  LARGE: 250
}
interface ColumnInterface {
  width: number
  inactive: boolean
  label: string
  value?: string
  getString: (key: string) => string
  hideValuesRow: boolean
}

const getColumnValue = (formikValues: any, column: EXP_BREAKDOWN_INPUTS): string | undefined => {
  const { minutes, hours, dayOfMonth, month, dayOfWeek, selectedScheduleTab, expression } = formikValues

  const expressionArr =
    expression?.trim() && selectedScheduleTab === scheduleTabsId.CUSTOM ? expression.trim().split(' ') : undefined
  if (column === EXP_BREAKDOWN_INPUTS.MINUTES) {
    return expressionArr?.[0] || minutes
  } else if (column === EXP_BREAKDOWN_INPUTS.HOURS) {
    return expressionArr?.[1] || hours
  } else if (column === EXP_BREAKDOWN_INPUTS.DAY_OF_MONTH) {
    return expressionArr?.[2] || dayOfMonth
  } else if (column === EXP_BREAKDOWN_INPUTS.MONTH) {
    return expressionArr?.[3] || month
  } else if (column === EXP_BREAKDOWN_INPUTS.DAY_OF_WEEK) {
    return expressionArr?.[4] || dayOfWeek
  }
  return undefined
}

const Column = ({ width, inactive, label, value, getString, hideValuesRow }: ColumnInterface): JSX.Element => (
  <Layout.Vertical width={width} className={css.column}>
    <Container className={css.label}>
      <Text>{label}</Text>
    </Container>
    {!hideValuesRow && (
      <Container className={cx(css.value, inactive && css.inactive)}>
        <Text>{(!isUndefined(value) && value) || getString('invalidText')}</Text>
      </Container>
    )}
  </Layout.Vertical>
)

const ExpressionBreakdown: React.FC<ExpressionBreakdownPropsInterface> = ({
  formikValues,
  formikValues: { selectedScheduleTab },
  activeInputs
}): JSX.Element => {
  const { getString } = useStrings()
  const minutesValue = getColumnValue(formikValues, EXP_BREAKDOWN_INPUTS.MINUTES)
  const hideValuesRow = selectedScheduleTab === scheduleTabsId.CUSTOM && isUndefined(minutesValue)
  return (
    <Container className={css.expressionBreakdown}>
      <Text className={css.title}>{getString('pipeline-triggers.schedulePanel.expressionBreakdown')}</Text>
      <Layout.Horizontal>
        <Column
          width={ColumnWidth.SMALL}
          label={getString('pipeline-triggers.schedulePanel.minutesLabel')}
          value={minutesValue}
          inactive={!activeInputs.includes(ActiveInputs.MINUTES)}
          getString={getString}
          hideValuesRow={hideValuesRow}
        />
        <Column
          width={ColumnWidth.SMALL}
          label={getString('pipeline-triggers.schedulePanel.hoursLabel')}
          value={getColumnValue(formikValues, EXP_BREAKDOWN_INPUTS.HOURS)}
          inactive={!activeInputs.includes(ActiveInputs.HOURS)}
          getString={getString}
          hideValuesRow={hideValuesRow}
        />
        <Column
          width={ColumnWidth.MEDIUM}
          label={getString('pipeline-triggers.schedulePanel.dayOfMonthLabel')}
          value={getColumnValue(formikValues, EXP_BREAKDOWN_INPUTS.DAY_OF_MONTH)}
          inactive={!activeInputs.includes(ActiveInputs.DAY_OF_MONTH)}
          getString={getString}
          hideValuesRow={hideValuesRow}
        />
        <Column
          width={ColumnWidth.SMALL}
          label={getString('pipeline-triggers.schedulePanel.monthLabel')}
          value={getColumnValue(formikValues, EXP_BREAKDOWN_INPUTS.MONTH)}
          inactive={!activeInputs.includes(ActiveInputs.MONTH)}
          getString={getString}
          hideValuesRow={hideValuesRow}
        />
        <Column
          width={ColumnWidth.LARGE}
          label={getString('pipeline-triggers.schedulePanel.dayOfWeekLabel')}
          value={getColumnValue(formikValues, EXP_BREAKDOWN_INPUTS.DAY_OF_WEEK)}
          inactive={!activeInputs.includes(ActiveInputs.DAY_OF_WEEK)}
          getString={getString}
          hideValuesRow={hideValuesRow}
        />
      </Layout.Horizontal>
    </Container>
  )
}
export default ExpressionBreakdown
