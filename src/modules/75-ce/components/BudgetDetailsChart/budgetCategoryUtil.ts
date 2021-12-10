import moment from 'moment'
import { BudgetCostData, BudgetPeriod } from 'services/ce/services'

export const computeCategories: (chartData: BudgetCostData[], budgetPeriod: BudgetPeriod) => string[] = (
  chartData,
  budgetPeriod
) => {
  const cat = chartData.map(item => {
    const startTime = moment.utc(item.time)
    const endTime = moment.utc(item.endTime)
    return getTimeRangeExpression(budgetPeriod, startTime, endTime)
  })

  return cat
}

export const getTimeRangeExpression: (
  budgetPeriod: BudgetPeriod,
  startTime: moment.Moment,
  endTime: moment.Moment
) => string = (budgetPeriod, startTime, endTime) => {
  let rangeTxt = ''

  switch (budgetPeriod) {
    case BudgetPeriod.Monthly:
      if (startTime.get('month') === endTime.get('month')) {
        rangeTxt = startTime.format('MMM YYYY')
      } else {
        rangeTxt = `${startTime.format('D MMM YY')} -  ${endTime.format('D MMM YY')}`
      }
      break

    case BudgetPeriod.Quarterly:
    case BudgetPeriod.Yearly:
      rangeTxt = `${startTime.format('MMM YYYY')} - ${endTime.format('MMM YYYY')}`
      break

    case BudgetPeriod.Weekly:
      rangeTxt = `${startTime.format('D MMM')} - ${endTime.format('D MMM')}`
      break

    case BudgetPeriod.Daily:
      rangeTxt = `${startTime.format('D MMM')}`
      break

    default:
      rangeTxt = startTime.format('MMM YYYY')
  }

  return rangeTxt
}