import React from 'react'
import { Menu, MenuItem, Position } from '@blueprintjs/core'
import { Button, Popover } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import css from './TimeRangeSelector.module.scss'

export enum TIME_RANGE_ENUMS {
  SIX_MONTHS = 'TIME_RANGE_ENUMS.SIX_MONTHS',
  ONE_MONTH = 'TIME_RANGE_ENUMS.ONE_MONTH',
  ONE_WEEK = 'TIME_RANGE_ENUMS.ONE_WEEK',
  ONE_DAY = 'TIME_RANGE_ENUMS.ONE_DAY'
}

export const getMillisecondsEquivalentForTimeRange = (timeRange: TIME_RANGE_ENUMS): number => {
  switch (timeRange) {
    case TIME_RANGE_ENUMS.SIX_MONTHS:
      return 6 * 30 * 24 * 60 * 60 * 1000
    case TIME_RANGE_ENUMS.ONE_MONTH:
      return 30 * 24 * 60 * 60 * 1000
    case TIME_RANGE_ENUMS.ONE_WEEK:
      return 7 * 24 * 60 * 60 * 1000
    case TIME_RANGE_ENUMS.ONE_DAY:
      return 24 * 60 * 60 * 1000
    default:
      return 0
  }
}

// Todo - Jasmeet - change return values once API is fixed
export const getBucketSizeForTimeRange = (timeRange: TIME_RANGE_ENUMS): number => {
  switch (timeRange) {
    case TIME_RANGE_ENUMS.SIX_MONTHS:
      return 1
    case TIME_RANGE_ENUMS.ONE_MONTH:
      return 1
    case TIME_RANGE_ENUMS.ONE_WEEK:
      return 1
    case TIME_RANGE_ENUMS.ONE_DAY:
      return 1
    default:
      return 1
  }
}

export const useTimeRangeOptions = (): Record<TIME_RANGE_ENUMS, string> => {
  const { getString } = useStrings()
  return {
    [TIME_RANGE_ENUMS.SIX_MONTHS]: getString('dashboards.serviceDashboard.months'),
    [TIME_RANGE_ENUMS.ONE_MONTH]: getString('dashboards.serviceDashboard.month'),
    [TIME_RANGE_ENUMS.ONE_WEEK]: getString('dashboards.serviceDashboard.week'),
    [TIME_RANGE_ENUMS.ONE_DAY]: getString('dashboards.serviceDashboard.day')
  }
}

export const TimeRangeSelector: React.FC<{
  mode: TIME_RANGE_ENUMS
  setMode: (mode: TIME_RANGE_ENUMS) => void
}> = props => {
  const { mode, setMode } = props
  const TIME_RANGE_OPTIONS: Record<TIME_RANGE_ENUMS, string> = useTimeRangeOptions()
  return (
    <Popover
      minimal
      captureDismiss
      className={css.timeRangeSelector}
      content={
        <Menu>
          {(Object.keys(TIME_RANGE_OPTIONS) as unknown as TIME_RANGE_ENUMS[]).map(timeRangeOptionKey => {
            return (
              <MenuItem
                text={TIME_RANGE_OPTIONS[timeRangeOptionKey]}
                onClick={() => setMode(timeRangeOptionKey)}
                key={timeRangeOptionKey}
              />
            )
          })}
        </Menu>
      }
      position={Position.BOTTOM}
    >
      <Button
        rightIcon="caret-down"
        height={20}
        text={TIME_RANGE_OPTIONS[mode]}
        minimal
        className={css.timeRangeButton}
        font={{ size: 'xsmall' }}
      />
    </Popover>
  )
}
