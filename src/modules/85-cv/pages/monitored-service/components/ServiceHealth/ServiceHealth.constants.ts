// TODO this will be removed once the api data is available
export const tickerData = [
  {
    percentage: 2,
    label: 'Changes',
    count: 26,
    id: 1
  },
  {
    percentage: 6,
    label: 'Deployments',
    count: 2,
    id: 2
  },
  {
    percentage: 11,
    label: 'Infrastructure',
    count: 16,
    id: 3
  },
  {
    percentage: 11,
    label: 'Alerts',
    count: 8,
    id: 4
  }
]

export enum TimePeriodEnum {
  FOUR_HOURS = 'FOUR_HOURS',
  TWENTY_FOUR_HOURS = 'TWENTY_FOUR_HOURS',
  THREE_DAYS = 'THREE_DAYS',
  SEVEN_DAYS = 'SEVEN_DAYS',
  THIRTY_DAYS = 'THIRTY_DAYS'
}

export const NUMBER_OF_DATA_POINTS = 48

export const HOURS = 'hours'
export const DAYS = 'days'
export const hoursTimeFormat = 'hh:mma'
export const daysTimeFormat = 'DoMMM hh:mma'
