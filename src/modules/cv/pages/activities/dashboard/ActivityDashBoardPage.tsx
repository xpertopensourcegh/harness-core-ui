import React from 'react'
import { CircularPercentageChart, Color, Container, Text } from '@wings-software/uikit'
import moment from 'moment'
import { Page } from 'modules/common/exports'
import i18n from './ActivityDashboardPage.i18n'
import { ActivityTimeline } from './ActivityTimeline/ActivityTimeline'
import type { Activity } from './ActivityTimeline/ActivityTrack/ActivityTrackUtils'

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
    </Container>
  )
}

const startTime = Math.round(new Date().getTime() / (5 * 60000)) * 5 * 60000
const endTime = moment(startTime).subtract(2, 'weeks').valueOf()
const ActivityTypes = {
  DEPLOYMENT: 'DEPLOYMENT',
  OTHER_CHANGES: 'OTHER CHANGES',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  CONFIG_CHANGES: 'CONFIG CHANGES'
}

const MockData = {
  [ActivityTypes.DEPLOYMENT]: [],
  [ActivityTypes.OTHER_CHANGES]: [],
  [ActivityTypes.INFRASTRUCTURE]: [],
  [ActivityTypes.CONFIG_CHANGES]: []
}

for (const activityType of Object.keys(MockData)) {
  for (let currTime = startTime; currTime >= endTime; currTime -= (Math.floor(Math.random() * 10) + 5) * 60000) {
    const shouldAddEvent = Math.floor(Math.random() * 5)
    if (!shouldAddEvent) {
      MockData[activityType].push({
        startTime: currTime,
        progress: Math.floor(Math.random() * 100),
        activityName: 'Build 78',
        activitySummaryText: 'Delegate'
      } as never)
    }
  }
}

MockData[ActivityTypes.DEPLOYMENT].unshift({
  startTime,
  progress: Math.floor(Math.random() * 100),
  activityName: 'Build 78',
  activitySummaryText: 'Delegate'
} as never)
MockData[ActivityTypes.DEPLOYMENT].unshift({
  startTime,
  progress: Math.floor(Math.random() * 100),
  activityName: 'Build 100',
  activitySummaryText: 'Manager'
} as never)

function renderActivityCardContent(data: Activity): JSX.Element {
  return <ActivityCardContent activity={data} />
}

export default function ActivityDashboardPage(): JSX.Element {
  return (
    <>
      <Page.Header title={i18n.pageTitle} />
      <Page.Body>
        <ActivityTimeline
          startTime={Date.now()}
          endTime={Date.now()}
          onLoadMore={() => []}
          activityTracks={[
            {
              trackName: i18n.activityTrackTitle.deployment,
              trackIcon: {
                name: 'nav-cd',
                size: 22
              },
              startTime,
              endTime,
              cardContent: renderActivityCardContent,
              onActivityClick: () => undefined,
              activities: MockData[ActivityTypes.DEPLOYMENT]
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
              activities: MockData[ActivityTypes.CONFIG_CHANGES]
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
              activities: MockData[ActivityTypes.INFRASTRUCTURE]
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
              activities: MockData[ActivityTypes.OTHER_CHANGES]
            }
          ]}
        />
      </Page.Body>
    </>
  )
}
