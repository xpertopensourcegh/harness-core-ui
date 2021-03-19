import { zeroFiftyNineDDOptions, amPmOptions, oneTwelveDDOptions } from '@common/components/TimeSelect/TimeSelectUtils'

export const zeroFiftyNineOptions = Array.from({ length: 60 }, (_, i) => ({ label: `${i}`, value: `${i}` }))
export const oneFiftyNineOptions = zeroFiftyNineOptions.slice(1)
export const zeroTwentyThreeOptions = Array.from({ length: 24 }, (_, i) => ({ label: `${i}`, value: `${i}` }))
export const oneTwentyThreeOptions = zeroTwentyThreeOptions.slice(1)
export const zeroThirtyOneOptions = Array.from({ length: 32 }, (_, i) => ({ label: `${i}`, value: `${i}` }))
export const oneThirtyOneOptions = zeroThirtyOneOptions.slice(1)
export const oneFiftyNineDDOptions = zeroFiftyNineDDOptions.slice(1)
export const oneTwelveOptions = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
const getPostPosition = (i: number): string => {
  if (i == 1 || i == 21 || i == 31) {
    return 'st'
  } else if (i == 2 || i == 22) {
    return 'nd'
  } else if (i == 3 || i == 23) {
    return 'rd'
  } else {
    return 'th'
  }
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const monthOptions = months.map(month => ({ label: month, value: month }))

export const nthDayOptions = Array.from({ length: 31 }, (_, i) => {
  const value = i + 1
  const label = `${value}${getPostPosition(value)} Day`

  return { label, value: `${value}` }
})

export enum DaysOfWeek {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN'
}
export const shortDays: DaysOfWeek[] = [
  DaysOfWeek.MON,
  DaysOfWeek.TUE,
  DaysOfWeek.WED,
  DaysOfWeek.THU,
  DaysOfWeek.FRI,
  DaysOfWeek.SAT,
  DaysOfWeek.SUN
]

export const defaultScheduleValues = {
  MINUTES: oneFiftyNineOptions[0].value,
  DAYS: oneThirtyOneOptions[0].value,
  HOURS: oneTwelveDDOptions[0],
  TIME_MINUTES: zeroFiftyNineDDOptions[0].value,
  MINUTES_1: oneFiftyNineOptions[0].value,
  AM_PM: amPmOptions[0],
  DAYS_OF_WEEK: [DaysOfWeek.MON],
  CUSTOM: '20 4 * * *'
}

export const scheduleTabsId = {
  MINUTES: 'Minutes',
  HOURLY: 'Hourly',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
  CUSTOM: 'Custom'
}

export const resetScheduleObject = {
  minutes: undefined,
  hours: undefined,
  dayOfMonth: undefined,
  month: undefined,
  dayOfWeek: undefined,
  custom: undefined
}

export enum EXP_BREAKDOWN_INPUTS {
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAY_OF_MONTH = 'DAY_OF_MONTH',
  MONTH = 'MONTH',
  DAY_OF_WEEK = 'DAY_OF_WEEK'
}
