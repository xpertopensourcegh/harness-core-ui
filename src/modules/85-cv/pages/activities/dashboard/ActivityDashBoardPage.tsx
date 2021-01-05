import React, { useEffect, useState } from 'react'
import { CircularPercentageChart, Color, Container, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import type { IconProps } from '@wings-software/uicore/dist/icons/Icon'
import { Page } from '@common/exports'
import { useStrings } from 'framework/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { RestResponseListActivityDashboardDTO, useListActivitiesForDashboard } from 'services/cv'
import i18n from './ActivityDashboardPage.i18n'
import { ActivityTimeline } from './ActivityTimeline/ActivityTimeline'
import type { Activity } from './ActivityTimeline/ActivityTrack/ActivityTrackUtils'
import { DeploymentSummaryCardView } from './SummaryCardViews/DeploymentSummaryCardView/DeploymentSummaryCardView'
import type { ActivityTrackProps } from './ActivityTimeline/ActivityTrack/ActivityTrack'
import { aggregateActivityByType, activityStatusToColor } from './ActivityDashboardPageUtils'
import css from './ActivityDashBoardPage.module.scss'

interface ActivityCardContentProps {
  activity: Activity
}

interface AggregateActivityCardPrps {
  activities: Activity[]
}

const ActivityTypes = {
  DEPLOYMENT: 'DEPLOYMENT',
  OTHER_CHANGES: 'OTHER',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  CONFIG_CHANGES: 'CONFIG'
}

const ActivityTypesToIcon: { [key: string]: IconProps } = {
  [ActivityTypes.DEPLOYMENT]: { name: 'cd-main', size: 20 },
  [ActivityTypes.INFRASTRUCTURE]: { name: 'service-kubernetes', size: 20 },
  [ActivityTypes.CONFIG_CHANGES]: { name: 'config-change', size: 20 },
  [ActivityTypes.OTHER_CHANGES]: { name: 'config-change', size: 20 }
}

const timelineStartTime = Math.round(Date.now() / (5 * 60000)) * 5 * 60000

function ActivityCardContent(props: ActivityCardContentProps): JSX.Element {
  const { activity } = props
  return (
    <Container>
      <CircularPercentageChart
        value={activity.progress}
        size={30}
        color={activityStatusToColor(activity.activityStatus)}
        icon={activity?.activityType ? ActivityTypesToIcon[activity.activityType] : { name: 'circle', size: 20 }}
        font={{ size: 'small' }}
      />
      <Text lineClamp={2} className={css.cardText}>
        {activity.activityName}
      </Text>
      <Text font={{ size: 'small' }} style={{ marginTop: '2px' }}>
        {moment(activity.startTime).format('MMM D, YYYY h:mm a')}
      </Text>
    </Container>
  )
}

function AggregateActivityCard(props: AggregateActivityCardPrps): JSX.Element {
  const { activities } = props
  const { getString } = useStrings()
  const aggregatedEvents = aggregateActivityByType(getString, activities)

  return (
    <Container>
      <CircularPercentageChart
        value={0}
        size={30}
        color={Color.BLUE_500}
        icon={
          activities?.[0]?.activityType ? ActivityTypesToIcon[activities[0].activityType] : { name: 'circle', size: 20 }
        }
        font={{ size: 'small' }}
      />
      {Array.from(aggregatedEvents.entries()).map(aggregatedEvent => {
        const [eventType, event] = aggregatedEvent
        if (event.totalCount === 0) return null
        return (
          <Text
            key={eventType}
            lineClamp={1}
            className={css.cardText}
            icon={event.iconProps.name}
            iconProps={{
              size: event.iconProps.size
            }}
          >
            {`${event.totalCount} ${eventType}`}
          </Text>
        )
      })}
    </Container>
  )
}

function generateActivityTracks(startTime: number, endTime: number): ActivityTrackProps[] {
  return [
    {
      trackName: i18n.activityTrackTitle.deployment,
      trackIcon: {
        name: 'cd-main',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      aggregateCoverCard: renderAggregateActivityCard,
      onActivityClick: () => undefined,
      activities: []
    },
    {
      trackName: i18n.activityTrackTitle.configChanges,
      trackIcon: {
        name: 'config-change',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      aggregateCoverCard: renderAggregateActivityCard,
      onActivityClick: () => undefined,
      activities: []
    },
    {
      trackName: i18n.activityTrackTitle.infrastructure,
      trackIcon: {
        name: 'service-kubernetes',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      aggregateCoverCard: renderAggregateActivityCard,
      onActivityClick: () => undefined,
      activities: []
    },
    {
      trackName: i18n.activityTrackTitle.otherChanges,
      trackIcon: {
        name: 'config-change',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      aggregateCoverCard: renderAggregateActivityCard,
      onActivityClick: () => undefined,
      activities: []
    }
  ]
}

function transformGetApi(
  timelineEndTime: number,
  response: RestResponseListActivityDashboardDTO | null
): ActivityTrackProps[] {
  if (!response?.resource?.length) return []
  const { resource: activities } = response
  const timelineActivityData = generateActivityTracks(timelineStartTime, timelineEndTime)
  const activityTypeToTrackIndex = {
    DEPLOYMENT: 0,
    CONFIG: 1,
    INFRASTRUCTURE: 2,
    CUSTOM: 3,
    OTHER: 3,
    KUBERNETES: 2
  }
  for (const activity of activities) {
    const {
      activityType,
      activityId,
      activityName,
      activityStartTime,
      environmentIdentifier,
      serviceIdentifier,
      environmentName,
      activityVerificationSummary
    } = activity || {}

    if (
      !activityType ||
      !activityId ||
      !activityName ||
      !activityStartTime ||
      !environmentIdentifier ||
      !serviceIdentifier ||
      !activityVerificationSummary
    ) {
      continue
    }

    timelineActivityData[activityTypeToTrackIndex[activityType]]?.activities.push({
      startTime: activityStartTime,
      progress: activityVerificationSummary.progressPercentage || 0,
      activityName,
      activityStatus: activity.verificationStatus,
      riskScore: activityVerificationSummary.riskScore || -1,
      activityType,
      environmentName,
      serviceIdentifier,
      uuid: activityId
    })
  }
  for (const track of timelineActivityData) {
    track.activities.sort((a, b) => b.startTime - a.startTime)
  }

  return timelineActivityData
}

// function generateMockData(startTime: number, endTime: number, mockData: ActivityTrackProps[]): ActivityTrackProps[] {
//   for (let activityTypeIndex = 0; activityTypeIndex < Object.keys(ActivityTypes).length; activityTypeIndex++) {
//     mockData[activityTypeIndex].activities = [...mockData[activityTypeIndex].activities]
//     for (let currTime = startTime; currTime >= endTime; currTime -= (Math.floor(Math.random() * 120) + 5) * 60000) {
//       const shouldAddEvent = Math.floor(Math.random() * 5)
//       if (!shouldAddEvent) {
//         mockData[activityTypeIndex].activities.push({
//           startTime: currTime,
//           progress: Math.floor(Math.random() * 100),
//           activityName: 'Build 78',
//           riskScore: Math.floor(Math.random() * 100),
//           activityType: Object.keys(ActivityTypes)[activityTypeIndex],
//           activitySummaryText: 'Delegate',
//           uuid: Utils.randomId()
//         } as never)
//       }
//     }
//   }

//   return [...mockData]
// }
function renderActivityCardContent(data: Activity): JSX.Element {
  return <ActivityCardContent activity={data} />
}

function renderAggregateActivityCard(activities: Activity[]): JSX.Element {
  return <AggregateActivityCard activities={activities} />
}

function renderSummaryCardContent(data: Activity, onClose: () => void): JSX.Element {
  if (!data) return <Container />
  if (data.activityType === ActivityTypes.DEPLOYMENT) {
    return <DeploymentSummaryCardView selectedActivity={data} onClose={onClose} />
  }
  return <Container />
}

export default function ActivityDashboardPage(): JSX.Element {
  const { orgIdentifier, projectIdentifier, accountId } = useParams<ProjectPathProps>()
  const timelineEndTime = moment(timelineStartTime).subtract(6, 'months').startOf('month').valueOf()
  // const [timelineData, setTimelineData] = useState<ActivityTrackProps[]>(
  //   generateMockData(
  //     timelineStartTime,
  //     moment(timelineStartTime).startOf('month').valueOf(),
  //     generateActivityTracks(timelineStartTime, moment(timelineStartTime).startOf('month').valueOf())
  //   )
  // )
  const [timelineData, setTimelineData] = useState<ActivityTrackProps[]>(
    generateActivityTracks(timelineStartTime, moment(timelineStartTime).startOf('month').valueOf())
  )
  const { loading, error, refetch: refetchActivities, data } = useListActivitiesForDashboard({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      startTime: timelineEndTime,
      endTime: timelineStartTime
    }
  })

  useEffect(() => {
    setTimelineData(transformGetApi(timelineEndTime, data))
  }, [data, timelineEndTime])

  return (
    <>
      <Page.Header title={i18n.pageTitle} />
      <Page.Body loading={loading} error={error?.message}>
        <ActivityTimeline
          timelineStartTime={timelineStartTime}
          timelineEndTime={timelineEndTime}
          renderSummaryCardContent={renderSummaryCardContent}
          onLoadMore={(startTime: number, endTime: number) => {
            refetchActivities({
              queryParams: {
                startTime: endTime,
                endTime: startTime,
                accountId,
                projectIdentifier,
                orgIdentifier
              }
            })
          }}
          activityTracks={timelineData}
        />
      </Page.Body>
    </>
  )
}
