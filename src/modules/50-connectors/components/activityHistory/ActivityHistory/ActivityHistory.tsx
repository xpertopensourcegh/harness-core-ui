import React, { useState } from 'react'
import moment from 'moment'

import { Position } from '@blueprintjs/core'
import { DateRangePicker, DateRange, IDateRangeShortcut } from '@blueprintjs/datetime'
import { Container, Color, Layout, Popover, Button, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import {
  GetActivitiesSummaryQueryParams,
  useListActivities,
  ResponsePageActivity,
  useGetConnectivitySummary,
  ResponseConnectivityCheckSummary
} from 'services/cd-ng'
import { PageSpinner } from 'modules/10-common/components/Page/PageSpinner'

import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import ActivityList from '../ActivityList/ActivityList'
import ActivityGraph from '../ActivityGraph/ActivityGraph'

import i18n from './ActivityHistory.i18n'
import css from './ActivityHistory.module.scss'

interface ActivityHistoryprops {
  entityIdentifier: string
  mockActivitykData?: UseGetMockData<ResponsePageActivity>
  mockConnectivitySummary?: UseGetMockData<ResponseConnectivityCheckSummary>
}
export interface ActivityGraphDataType {
  Success: Array<Array<number | undefined>>
  Failure: Array<Array<number | undefined>>
  HeartBeatFailure: Array<Array<number | undefined>>
}

const DATE_FORMAT = 'DD MMMM YYYY '
export const today = () => moment()
export const yesterday = () => moment().subtract(1, 'days')
const startOfDay = (time: moment.Moment) => time.startOf('day').toDate()
const endOfDay = (time: moment.Moment) => time.endOf('day').toDate()

export function buildDateRangeShortcuts(): IDateRangeShortcut[] {
  return ([
    {
      dateRange: [startOfDay(today()), startOfDay(today())],
      label: i18n.shortcuts.Today,
      includeTime: true
    },
    {
      dateRange: [startOfDay(yesterday()), startOfDay(yesterday())],
      label: i18n.shortcuts.Yesterday,
      includeTime: true
    },
    {
      dateRange: [startOfDay(today().subtract(2, 'days')), endOfDay(yesterday())],
      label: i18n.shortcuts.Last2Days,
      includeTime: true
    },
    {
      dateRange: [startOfDay(today().subtract(3, 'days')), endOfDay(yesterday())],
      label: i18n.shortcuts.Last3Days,
      includeTime: true
    },
    {
      dateRange: [startOfDay(today().subtract(6, 'days')), endOfDay(today())],
      label: i18n.shortcuts.LastWeek,
      includeTime: true
    },
    {
      dateRange: [startOfDay(today().subtract(30, 'days')), endOfDay(yesterday())],
      label: i18n.shortcuts.LastMonth,
      includeTime: true
    },
    {
      dateRange: [startOfDay(today().subtract(60, 'days')), endOfDay(yesterday())],
      label: i18n.shortcuts.Last2Months,
      includeTime: true
    }
  ] as unknown) as IDateRangeShortcut[]
}

const ActivityHistory: React.FC<ActivityHistoryprops> = props => {
  const [showConnectivityChecks, setShowConnectivityChecks] = useState<boolean>(true)
  const [showOtherActivity, setShowOtherActivity] = useState<boolean>(true)
  const [dateRange, setDateRange] = useState<DateRange>([startOfDay(today()), endOfDay(today())])
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState<boolean>(false)
  const [dataFormat, setDataFormat] = useState<GetActivitiesSummaryQueryParams['timeGroupType']>('HOUR')
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { data: activityList, loading, refetch: refetchActivities } = useListActivities({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier: projectIdentifier,
      orgIdentifier: orgIdentifier,
      identifier: props.entityIdentifier,
      startTime: moment(dateRange[1]).startOf('day').valueOf(),
      endTime: moment(dateRange[1]).endOf('day').valueOf()
    },
    mock: props.mockActivitykData
  })

  const {
    data: connectivitySummary,
    loading: loadingConnectivitySummary,
    refetch: refetchConnectivitySummary
  } = useGetConnectivitySummary({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier: projectIdentifier,
      orgIdentifier: orgIdentifier,
      identifier: props.entityIdentifier,
      startTime: moment(dateRange[1]).startOf('day').valueOf(),
      endTime: moment(dateRange[1]).endOf('day').valueOf()
    },
    mock: props.mockConnectivitySummary
  })

  const getDateRangeText = (): JSX.Element => {
    return (
      <Text color={Color.DARK_600}>{`${moment(dateRange[0]?.valueOf()).format(DATE_FORMAT)}- ${moment(
        dateRange[1]?.valueOf()
      ).format(DATE_FORMAT)}`}</Text>
    )
  }

  return (
    <Layout.Vertical background={Color.GREY_100} className={css.page} padding="xlarge" border={true}>
      <Container background={Color.WHITE}>
        <Popover
          minimal
          position={Position.BOTTOM_RIGHT}
          isOpen={isDateRangePickerOpen}
          className={css.popoverClassname}
          popoverClassName={css.popoverClassname}
        >
          <Button
            large
            text={getDateRangeText()}
            icon="calendar"
            rightIcon="chevron-down"
            margin="small"
            color={Color.BLUE_500}
            onClick={() => setIsDateRangePickerOpen(!isDateRangePickerOpen)}
          />
          <DateRangePicker
            className={css.dateRangePicker}
            maxDate={new Date()}
            shortcuts={buildDateRangeShortcuts()}
            onChange={range => {
              if (range[0] && range[1]) {
                setShowConnectivityChecks(true)
                setShowOtherActivity(true)
                if (range[0].valueOf() === range[1].valueOf()) {
                  setDataFormat('HOUR')
                } else {
                  setDataFormat('DAY')
                }

                setDateRange(range)
                setIsDateRangePickerOpen(false)
              }
            }}
            allowSingleDayRange={true}
          />
        </Popover>
        <ActivityGraph
          entityIdentifier={props.entityIdentifier}
          dataFormat={dataFormat}
          dateRange={dateRange}
          refetchActivities={refetchActivities}
          refetchConnectivitySummary={refetchConnectivitySummary}
          setShowConnectivityChecks={setShowConnectivityChecks}
          setShowOtherActivity={setShowOtherActivity}
        />
      </Container>

      {!loading && !loadingConnectivitySummary ? (
        <ActivityList
          activityList={activityList || {}}
          connectivitySummary={connectivitySummary || {}}
          entityIdentifier={props.entityIdentifier}
          dateRange={dateRange}
          refetchActivities={refetchActivities}
          refetchConnectivitySummary={refetchConnectivitySummary}
          showConnectivityChecks={showConnectivityChecks}
          showOtherActivity={showOtherActivity}
        />
      ) : (
        <PageSpinner />
      )}
    </Layout.Vertical>
  )
}

export default ActivityHistory
