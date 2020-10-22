import moment from 'moment'
export const ACTIVITY_CARD_HEIGHT = 125
export const TOTAL_CARDS_PER_INTERVAL = 5
export const TIMELINE_INCREMENT_HEIGHT = TOTAL_CARDS_PER_INTERVAL * ACTIVITY_CARD_HEIGHT
export const BUCKET_TOP_OFFSET = 80 // to accomadate for the labels at the top of the tracks

export type Activity = {
  startTime: number
  uuid: string
  [key: string]: any
  offset?: number
  ref?: HTMLDivElement
}
export type ActivityBucket = {
  activities: Activity[]
  startTime: number
  endTime: number
  top: number
}

export function findTimeIncrement(
  startTime: number,
  endTime: number,
  totalCardsPerIncrement: number
): { incrementLabel: 'hours' | 'minutes'; incrementBy: number } {
  return moment(startTime).diff(moment(endTime), 'days') > 0
    ? { incrementLabel: 'hours', incrementBy: Math.round(24 / totalCardsPerIncrement) }
    : { incrementLabel: 'minutes', incrementBy: Math.round(60 / totalCardsPerIncrement) }
}

export function computeTimelineHeight(
  startTime: number,
  endTime: number
): { timelineHeight: number; timeDiffScale: string; totalTimeDifference: number } {
  const totalDaysDifference = moment(startTime).diff(moment(endTime), 'days')
  let timeDiffScale = 'days'
  let totalTimeDifference = totalDaysDifference
  if (totalDaysDifference < 1) {
    totalTimeDifference = moment(startTime).diff(moment(endTime), 'hours')
    timeDiffScale = 'hours'
  }
  return {
    timelineHeight: totalTimeDifference * TIMELINE_INCREMENT_HEIGHT,
    timeDiffScale,
    totalTimeDifference: totalDaysDifference * (timeDiffScale === 'days' ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60)
  }
}

export function computePositionOnTimeline(
  startTime: number,
  activityStartTime: number,
  totalTimeDifference: number,
  timelineHeight: number
): number {
  return BUCKET_TOP_OFFSET + ((startTime - activityStartTime) / totalTimeDifference) * timelineHeight
}

export function placeActivitiesOnTrack(startTime: number, endTime: number, activities: Activity[]): ActivityBucket[] {
  const incrementUnit = findTimeIncrement(startTime, endTime, TOTAL_CARDS_PER_INTERVAL)
  const activityBuckets: ActivityBucket[] = []
  const { timelineHeight, totalTimeDifference } = computeTimelineHeight(startTime, endTime)

  for (const activity of activities) {
    // filter out activities that don't have start time or that are outside of the timerange of the current time range
    if (!activity || !activity.startTime || activity.startTime < endTime || activity.startTime > startTime) {
      continue
    }

    // if an activity falls under a bucktes time range, assign activity to a bucket
    let isAddedToBucket = false
    for (const bucket of activityBuckets) {
      if (bucket.startTime >= activity.startTime && bucket.endTime <= activity.startTime) {
        bucket.activities.push(activity)
        isAddedToBucket = true
        break
      }
    }

    if (!isAddedToBucket) {
      activityBuckets.push({
        activities: [activity],
        startTime: activity.startTime,
        endTime: moment(activity.startTime).subtract(incrementUnit.incrementBy, incrementUnit.incrementLabel).valueOf(),
        top: computePositionOnTimeline(startTime, activity.startTime, totalTimeDifference, timelineHeight)
      })
    }
  }

  return activityBuckets
}
