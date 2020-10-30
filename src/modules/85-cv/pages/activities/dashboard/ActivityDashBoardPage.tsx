import React, { useState } from 'react'
import { CircularPercentageChart, Color, Container, Text, Utils } from '@wings-software/uikit'
import moment from 'moment'
import { Page } from '@common/exports'
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

const timelineStartTime = Math.round(new Date().getTime() / (5 * 60000)) * 5 * 60000

function generateMockData(startTime: number, endTime: number, mockData: ActivityTrackProps[]): ActivityTrackProps[] {
  for (let activityTypeIndex = 0; activityTypeIndex < Object.keys(ActivityTypes).length; activityTypeIndex++) {
    mockData[activityTypeIndex].activities = [...mockData[activityTypeIndex].activities]
    for (let currTime = startTime; currTime >= endTime; currTime -= (Math.floor(Math.random() * 120) + 5) * 60000) {
      const shouldAddEvent = Math.floor(Math.random() * 5)
      if (!shouldAddEvent) {
        mockData[activityTypeIndex].activities.push({
          startTime: currTime,
          progress: Math.floor(Math.random() * 100),
          activityName: 'Build 78',
          riskScore: Math.floor(Math.random() * 100),
          activityType: Object.keys(ActivityTypes)[activityTypeIndex],
          activitySummaryText: 'Delegate',
          uuid: Utils.randomId()
        } as never)
      }
    }
  }

  return [...mockData]
}

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
  const timelineEndTime = moment(timelineStartTime).subtract(15, 'weeks').valueOf()
  const [timelineData, setTimelineData] = useState<ActivityTrackProps[]>(
    generateMockData(timelineStartTime, moment(timelineStartTime).subtract(4, 'weeks').valueOf(), [
      {
        trackName: i18n.activityTrackTitle.deployment,
        trackIcon: {
          name: 'nav-cd',
          size: 22
        },
        startTime: timelineStartTime,
        endTime: timelineEndTime,
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
        startTime: timelineStartTime,
        endTime: timelineEndTime,
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
        startTime: timelineStartTime,
        endTime: timelineEndTime,
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
        startTime: timelineStartTime,
        endTime: timelineEndTime,
        cardContent: renderActivityCardContent,
        onActivityClick: () => undefined,
        activities: []
      }
    ])
  )

  return (
    <>
      <Page.Header title={i18n.pageTitle} />
      <Page.Body>
        <ActivityTimeline
          timelineStartTime={timelineStartTime}
          timelineEndTime={timelineEndTime}
          renderSummaryCardContent={renderSummaryCardContent}
          onLoadMore={(startTime: number) => {
            setTimelineData(generateMockData(startTime, moment(startTime).subtract(4, 'weeks').valueOf(), timelineData))
          }}
          activityTracks={timelineData}
        />
      </Page.Body>
    </>
  )
}
