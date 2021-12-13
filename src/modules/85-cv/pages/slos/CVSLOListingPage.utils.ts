import type Highcharts from 'highcharts'
import type { UserJourneyResponse, UserJourneyDTO, SLODashboardWidget } from 'services/cv'

export const getUserJourneys = (userJourneyResponse?: UserJourneyResponse[]): UserJourneyDTO[] => {
  return userJourneyResponse?.map(response => response.userJourney) ?? []
}

export const getErrorBudgetGaugeOptions = (serviceLevelObjective: SLODashboardWidget): Highcharts.Options => ({
  yAxis: {
    max: serviceLevelObjective.totalErrorBudget
  },
  series: [
    {
      type: 'solidgauge',
      data: [
        {
          y: serviceLevelObjective.errorBudgetRemaining
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
