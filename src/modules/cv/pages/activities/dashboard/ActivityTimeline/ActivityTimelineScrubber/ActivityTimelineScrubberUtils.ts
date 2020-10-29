import moment from 'moment'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'

export type ScrubberLaneActivity = {
  riskScores: number[] // all scores that are aggregated
  overallRiskScore: number // an average score for each activity in activities array
  positionTop: number // position from top of the scrubber lane value
}

export function getMonthIncrements(startTime: number, endTime: number): string[] {
  let currTime = startTime
  const months = []
  do {
    const currTimeMoment = moment(currTime)
    months.push(currTimeMoment.format('MMM'))
    currTime = currTimeMoment.subtract(1, 'month').valueOf()
  } while (currTime >= endTime)

  if (months[months.length - 1] !== moment(endTime).format('MMM')) {
    months.push(moment(endTime).format('MMM'))
  }

  return months
}

export function positionScrubberPoints(
  timelineStartTime: number,
  timelineEndTime: number,
  activities: Activity[],
  scrubberLaneHeight: number,
  minItemsDistance: number
): ScrubberLaneActivity[] {
  const timelineStartTimeMoment = moment(timelineStartTime)
  const totalTimeDifference = timelineStartTimeMoment.diff(timelineEndTime)
  const laneActivities: ScrubberLaneActivity[] = [
    {
      riskScores: [activities[0].riskScore],
      overallRiskScore: activities[0].riskScore,
      positionTop: (scrubberLaneHeight * timelineStartTimeMoment.diff(activities[0].startTime)) / totalTimeDifference
    }
  ]

  let currentBucketIndex = 0
  for (const activity of activities.slice(1, activities.length - 1)) {
    const { positionTop: currentBucketPosition, riskScores } = laneActivities[currentBucketIndex]
    const positionTop = (scrubberLaneHeight * timelineStartTimeMoment.diff(activity.startTime)) / totalTimeDifference

    if (Math.abs(positionTop - minItemsDistance) <= currentBucketPosition) {
      riskScores.push(activity.riskScore)
      laneActivities[currentBucketIndex].overallRiskScore =
        riskScores.reduce((currSum: number, currRiskScore: number) => currSum + currRiskScore, 0) / riskScores.length
    } else {
      currentBucketIndex++
      laneActivities.push({
        riskScores: [activity.riskScore],
        overallRiskScore: activity.riskScore,
        positionTop
      })
    }
  }

  return laneActivities
}
