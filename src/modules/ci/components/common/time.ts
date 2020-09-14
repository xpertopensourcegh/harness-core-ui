/**
 * Convert number of seconds to time format Hh MMm SSs
 *
 * @export
 * @param {number} seconds
 * @returns {string}
 */
export function formatElapsedTime(seconds: number, addLeadingZero = false): string {
  let ret = ''
  let remainingSec = seconds
  const numberSize = addLeadingZero ? 2 : 0

  const iteration = [
    { suffix: 'h', delimiter: 3600 }, // hours
    { suffix: 'm', delimiter: 60 }, // minutes
    { suffix: 's', delimiter: 1 } // seconds
  ]

  iteration.forEach(({ suffix, delimiter }) => {
    if (seconds >= delimiter) {
      const value = Math.floor(remainingSec / delimiter)
      const hoursStr = value.toString().padStart(numberSize, '0')
      ret = `${ret} ${hoursStr}${suffix}`
      remainingSec = remainingSec - value * delimiter
    }
  })

  return ret.trim()
}

/**
 * Returns unix timestamp in seconds
 *
 * @export
 * @returns unix timestamp
 */
export function getTimeStamp(): number {
  return Math.floor(Date.now() / 1000)
}
