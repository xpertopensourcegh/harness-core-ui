import React, { useState } from 'react'
import { CircularPercentageChart, Color, Container, Text } from '@wings-software/uikit'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import { RestResponseListActivityDashboardDTO, useListActivitiesForDashboard } from 'services/cv'
import i18n from './ActivityDashboardPage.i18n'
import { ActivityTimeline } from './ActivityTimeline/ActivityTimeline'
import type { Activity } from './ActivityTimeline/ActivityTrack/ActivityTrackUtils'
import { DeploymentSummaryCardView } from './SummaryCardViews/DeploymentSummaryCardView/DeploymentSummaryCardView'
import type { ActivityTrackProps } from './ActivityTimeline/ActivityTrack/ActivityTrack'

interface ActivityCardContentProps {
  activity: Activity
}

function ActivityCardContent(props: ActivityCardContentProps): JSX.Element {
  const { activity } = props
  return (
    <Container>
      <CircularPercentageChart
        value={activity.progress}
        size={30}
        color={Color.BLUE_500}
        icon={{
          name: 'nav-cd',
          size: 20
        }}
        font={{ size: 'small' }}
      />
      <Text color={Color.BLACK} lineClamp={2} font={{ size: 'small' }} style={{ marginTop: 'var(--spacing-xsmall)' }}>
        {activity.activityName}
      </Text>
      <Text>{new Date(activity.startTime).toLocaleString()}</Text>
    </Container>
  )
}

const ActivityTypes = {
  DEPLOYMENT: 'DEPLOYMENT',
  OTHER_CHANGES: 'OTHER CHANGES',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  CONFIG_CHANGES: 'CONFIG CHANGES'
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
      onActivityClick: () => undefined,
      activities: []
    },
    {
      trackName: i18n.activityTrackTitle.configChanges,
      trackIcon: {
        name: 'nav-cd',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      onActivityClick: () => undefined,
      activities: []
    },
    {
      trackName: i18n.activityTrackTitle.infrastructure,
      trackIcon: {
        name: 'nav-cd',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      onActivityClick: () => undefined,
      activities: []
    },
    {
      trackName: i18n.activityTrackTitle.otherChanges,
      trackIcon: {
        name: 'service-kubernetes',
        size: 22
      },
      startTime,
      endTime,
      cardContent: renderActivityCardContent,
      onActivityClick: () => undefined,
      activities: []
    }
  ]
}

const timelineStartTime = Math.round(new Date().getTime() / (5 * 60000)) * 5 * 60000

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

function renderSummaryCardContent(data: Activity): JSX.Element {
  if (!data) return <Container />
  if (data.activityType === ActivityTypes.DEPLOYMENT) {
    return <DeploymentSummaryCardView selectedActivity={data} />
  }
  return <Container />
}

export default function ActivityDashboardPage(): JSX.Element {
  const { orgIdentifier, projectIdentifier, accountId } = useParams()
  const timelineEndTime = moment(timelineStartTime).startOf('month').valueOf()
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
  const { loading, error, refetch: refetchActivities } = useListActivitiesForDashboard({
    queryParams: {
      accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      startTime: timelineEndTime,
      endTime: timelineStartTime
    },
    resolve: (response: RestResponseListActivityDashboardDTO) => {
      if (!response?.resource?.length) return response
      const { resource: activities } = response
      const timelineActivityData = generateActivityTracks(timelineStartTime, timelineEndTime)
      const activityTypeToTrackIndex = { DEPLOYMENT: 0, INFRASTRUCTURE: 2, CUSTOM: 3 }
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
      setTimelineData(timelineActivityData)
      return response
    }
  })

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
                projectIdentifier: projectIdentifier as string,
                orgIdentifier: orgIdentifier as string
              }
            })
          }}
          activityTracks={timelineData}
        />
      </Page.Body>
    </>
  )
}
