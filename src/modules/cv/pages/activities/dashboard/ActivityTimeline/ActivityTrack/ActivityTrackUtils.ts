import moment from 'moment'
export const ACTIVITY_CARD_HEIGHT = 125
export const TIMELINE_INCREMENT_HEIGHT = 500

export type Activity = { startTime: number; [key: string]: any }
export type ActivityBucket = {
  activities: Activity[]
  startTime: number
  endTime: number
  top: number
}

function findTimeIncrement(
  startTime: number,
  endTime: number,
  totalCardsPerIncrement: number
): { incrementLabel: 'hours' | 'minutes'; incrementBy: number } {
  return moment(startTime).diff(moment(endTime), 'days') > 0
    ? { incrementLabel: 'hours', incrementBy: Math.floor(24 / totalCardsPerIncrement) }
    : { incrementLabel: 'minutes', incrementBy: Math.floor(60 / totalCardsPerIncrement) }
}

export function placeActivitiesOnTrack(startTime: number, endTime: number, activities: Activity[]): ActivityBucket[] {
  const incrementUnit = findTimeIncrement(
    startTime,
    endTime,
    Math.floor(TIMELINE_INCREMENT_HEIGHT / ACTIVITY_CARD_HEIGHT)
  )
  const activityBuckets: ActivityBucket[] = []
  let bucketTopOffset = 80

  // create buckets to group activities into
  for (
    let currTime = startTime;
    currTime >= endTime;
    currTime = moment(currTime).subtract(incrementUnit.incrementBy, incrementUnit.incrementLabel).valueOf()
  ) {
    activityBuckets.push({
      activities: [],
      startTime: currTime,
      endTime: moment(currTime).subtract(incrementUnit.incrementBy, incrementUnit.incrementLabel).valueOf(),
      top: bucketTopOffset // position from the top of the track
    })
    bucketTopOffset +=
      ACTIVITY_CARD_HEIGHT +
      (currTime !== startTime && moment(startTime).diff(moment(currTime), 'hours') % 24 === 0 ? 20 : 5)
  }

  for (const activity of activities) {
    // filter out activities that don't have start time or that are outside of the timerange of the current bucket
    if (!activity || !activity.startTime || activity.startTime < endTime || activity.startTime > startTime) {
      continue
    }

    // assign activity to a bucket
    for (const bucket of activityBuckets) {
      if (bucket.startTime >= activity.startTime && bucket.endTime <= activity.startTime) {
        bucket.activities.push(activity)
        break
      }
    }
  }

  return activityBuckets
}
