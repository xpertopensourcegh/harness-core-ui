import moment from 'moment'
import { TimeRangeType } from '@ce/types'

export const todayInUTC = () => moment.utc()

export const GET_DATE_RANGE = {
  [TimeRangeType.LAST_7]: [todayInUTC().subtract(6, 'days').startOf('day').format(), todayInUTC().format()],
  [TimeRangeType.LAST_30]: [
    todayInUTC().subtract(30, 'days').startOf('day').format(),
    todayInUTC().subtract(1, 'days').format()
  ]
}
