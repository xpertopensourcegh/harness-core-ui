import React, { useMemo } from 'react'
import moment from 'moment'

import { Layout, Text, Icon, Color, IconName } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import type { CellProps, Renderer, Column } from 'react-table'
import type { DateRange } from '@blueprintjs/datetime'
import Table from 'modules/10-common/components/Table/Table'

import type { ResponsePageActivity, Activity, ResponseConnectivityCheckSummary } from 'services/cd-ng'

import { Page } from 'modules/10-common/exports'
import { ActivityStatus } from '@connectors/constants'

import i18n from './ActivityList.i18n'

interface ActivityListProps {
  activityList: ResponsePageActivity
  connectivitySummary: ResponseConnectivityCheckSummary
  entityIdentifier: string | undefined
  dateRange: DateRange
  refetchActivities: () => Promise<void>
  refetchConnectivitySummary: () => Promise<void>
  showOtherActivity: boolean
  showConnectivityChecks: boolean
}

interface AllActivity extends Activity {
  failureCount?: number
}

function getIconForActivity(data: Activity): IconName {
  if (data.type === 'CONNECTIVITY_CHECK') {
    return 'main-delete'
  }
  if (data.activityStatus === ActivityStatus.FAILED) {
    return 'warning-sign'
  } else {
    return 'tick'
  }
}

function getStatusText(data: AllActivity): string | undefined {
  if (data.type === 'CONNECTIVITY_CHECK') {
    return `${i18n.HeartbeatFailure} (${data.failureCount})`
  }
  if (data.type === 'ENTITY_CREATION') {
    return i18n.CreatedSuccessfully
  }
  if (data.type === 'ENTITY_UPDATE') {
    return i18n.UpdatedSuccessfully
  }
  if (data.activityStatus === ActivityStatus.FAILED) {
    return i18n.ConnectionFailed
  } else if (data.activityStatus === ActivityStatus.SUCCESS) {
    return i18n.ConnectionSuccessful
  }
}

const RenderColumnTime: Renderer<CellProps<Activity>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Vertical spacing="xsmall">
      <Text color={Color.DARK_600}>{i18n.ActivityLog}</Text>
      <Text font={{ size: 'small' }} color={Color.GREY_450}>
        {moment(data.activityTime).format('DD MMM YYYY')}
      </Text>
    </Layout.Vertical>
  )
}

const RenderColumnActivity: Renderer<CellProps<Activity>> = ({ row }) => {
  const data = row.original
  return <Text>{data.description}</Text>
}

const RenderColumnStatus: Renderer<CellProps<AllActivity>> = ({ row }) => {
  const data = row.original

  return (
    <Layout.Horizontal>
      <Icon
        name={getIconForActivity(data)}
        size={12}
        color={data.activityStatus === ActivityStatus.SUCCESS ? Color.GREEN_500 : Color.RED_500}
        style={{
          margin: '2px 5px'
        }}
      />

      <Layout.Vertical>
        <Text color={Color.DARK_600}>{getStatusText(data)}</Text>
        <Text font={{ size: 'small' }} color={Color.GREY_450}>
          {data.detail?.activityStatusMessage}
        </Text>
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

const ActivityList: React.FC<ActivityListProps> = props => {
  const { accountId } = useParams()
  const columns: Column<Activity>[] = useMemo(
    () => [
      {
        Header: i18n.Heading.TIME,
        accessor: 'activityTime',
        width: '25%',
        Cell: RenderColumnTime
      },
      {
        Header: i18n.Heading.ACTIVITY,
        accessor: 'description',
        width: '50%',
        Cell: RenderColumnActivity
      },
      {
        Header: i18n.Heading.STATUS,
        accessor: 'activityStatus',
        width: '25%',
        Cell: RenderColumnStatus
      }
    ],
    [props.refetchActivities, props.refetchConnectivitySummary]
  )
  const activity: AllActivity[] = useMemo(
    () => (props.showOtherActivity ? props.activityList?.data?.content || [] : []),
    [props.activityList?.data?.content, props.showOtherActivity]
  )

  const connectivity = useMemo(() => (props.showConnectivityChecks ? props.connectivitySummary?.data || null : null), [
    props.connectivitySummary?.data,
    props.showConnectivityChecks
  ])

  let dataArray
  if (props.showConnectivityChecks && props.connectivitySummary?.data && connectivity?.failureCount) {
    dataArray = activity.concat([
      {
        accountIdentifier: accountId,
        type: 'CONNECTIVITY_CHECK',
        activityTime: connectivity?.startTime as number,
        description: i18n.ConnectivityCheck,
        activityStatus: 'FAILED',
        detail: {
          activityStatusMessage: i18n.ConnectivityCheckFailed
        },
        failureCount: connectivity?.failureCount
      }
    ])
  } else {
    dataArray = activity
  }

  return (
    <Layout.Vertical>
      {dataArray?.length ? (
        <Table<AllActivity> columns={columns} data={dataArray || []} />
      ) : (
        <Page.NoDataCard icon="nav-dashboard" message={i18n.noData} />
      )}
    </Layout.Vertical>
  )
}
export default ActivityList
