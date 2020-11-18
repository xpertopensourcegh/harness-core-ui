import moment from 'moment'
import type { Activity } from '../ActivityTrack/ActivityTrackUtils'

export type ScrubberLaneActivity = {
  riskScores: number[] // all scores that are aggregated
  overallRiskScore: number // an average score for each activity in activities array
  positionTop: number // position from top of the scrubber lane value
}

export function getMonthIncrements(startTime: number, endTime: number): number[] {
  let currTime = startTime
  const months = []
  do {
    months.push(currTime)
    currTime = moment(currTime).subtract(1, 'month').valueOf()
  } while (currTime >= endTime)

  if (moment(months[months.length - 1]).format('MMM') !== moment(endTime).format('MMM')) {
    months.push(endTime)
  }

  return months
}

// use this when infinite scrolling is implemented
export function getScrubberLaneDataHeight(startTime: number, endTime: number, scrubberLaneElementHeight: number) {
  const endOfMonthTime = moment(startTime).endOf('month').valueOf()
  return scrubberLaneElementHeight * ((startTime - endTime) / (endOfMonthTime - endTime))
}

export function positionScrubberPoints(
  timelineStartTime: number,
  timelineEndTime: number,
  activities: Activity[],
  scrubberLaneHeight: number,
  minItemsDistance: number
): ScrubberLaneActivity[] {
  if (!activities?.length) return []

  const totalTimeDifference = timelineStartTime - timelineEndTime
  const laneActivities: ScrubberLaneActivity[] = [
    {
      riskScores: [activities[0].riskScore],
      overallRiskScore: activities[0].riskScore,
      positionTop: (scrubberLaneHeight * (timelineStartTime - activities[0].startTime)) / totalTimeDifference
    }
  ]

  let currentBucketIndex = 0
  for (const activity of activities.slice(1, activities.length)) {
    const { positionTop: currentBucketPosition, riskScores } = laneActivities[currentBucketIndex]
    const positionTop = (scrubberLaneHeight * (timelineStartTime - activity.startTime)) / totalTimeDifference
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
