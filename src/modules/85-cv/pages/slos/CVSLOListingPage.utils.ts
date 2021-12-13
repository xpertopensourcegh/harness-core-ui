import moment from 'moment'
import type Highcharts from 'highcharts'
import { Utils, Color } from '@wings-software/uicore'
import type { UserJourneyResponse, UserJourneyDTO, SLODashboardWidget } from 'services/cv'
import { getRiskColorValue } from '@cv/utils/CommonUtils'
import { SLOCardToggleViews, GetSLOAndErrorBudgetGraphOptions } from './CVSLOsListingPage.types'

export const getUserJourneys = (userJourneyResponse?: UserJourneyResponse[]): UserJourneyDTO[] => {
  return userJourneyResponse?.map(response => response.userJourney) ?? []
}

export const getErrorBudgetGaugeOptions = (serviceLevelObjective: SLODashboardWidget): Highcharts.Options => ({
  yAxis: {
    max: serviceLevelObjective.totalErrorBudget,
    tickPositions: [0, serviceLevelObjective.totalErrorBudget],
    minorTickLength: 0,
    tickLength: 0
  },
  series: [
    {
      type: 'solidgauge',
      data: [
        {
          y: serviceLevelObjective.errorBudgetRemaining,
          color: getRiskColorValue(serviceLevelObjective.errorBudgetRisk)
        }
      ],
      dataLabels: {
        formatter: function () {
          return `<div style="text-align:center">
            <span style="font-size:25px">
            ${Number(serviceLevelObjective.errorBudgetRemainingPercentage || 0).toFixed(2)}%</span>
            </div>`
        }
      }
    }
  ]
})

const getDateUnitAndInterval = (serviceLevelObjective: SLODashboardWidget): { unit: string; interval: number } => {
  const MILLISECONDS_PER_SIX_HOURS = 1000 * 60 * 60 * 6
  const timeline = serviceLevelObjective.currentPeriodLengthDays - serviceLevelObjective.timeRemainingDays

  if (timeline <= 3) {
    return { unit: 'hh:m A', interval: MILLISECONDS_PER_SIX_HOURS * timeline }
  }

  return { unit: 'MMM D', interval: MILLISECONDS_PER_SIX_HOURS * timeline }
}

export const getSLOAndErrorBudgetGraphOptions = ({
  type,
  minXLimit,
  maxXLimit,
  serviceLevelObjective
}: GetSLOAndErrorBudgetGraphOptions): Highcharts.Options => {
  const { unit, interval } = getDateUnitAndInterval(serviceLevelObjective)

  return {
    chart: { height: 200, spacing: [30, 0, 20, 0] },
    xAxis: {
      min: serviceLevelObjective.currentPeriodStartTime,
      tickInterval: interval,
      labels: {
        formatter: function () {
          return moment(this.value).format(unit)
        }
      }
    },
    yAxis: { min: minXLimit, max: maxXLimit },
    plotOptions:
      type === SLOCardToggleViews.ERROR_BUDGET ? { area: { color: Utils.getRealCSSColor(Color.RED_400) } } : undefined
  }
}
