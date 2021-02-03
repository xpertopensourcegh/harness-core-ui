import moment from 'moment'

export function getRelativeTime(t: string, format: string): string {
  return moment(t, format).fromNow()
}
