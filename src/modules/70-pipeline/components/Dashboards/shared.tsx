export function roundNumber(value?: number, precision = 2) {
  if (typeof value !== 'number') {
    return value
  }
  if (Number.isInteger(precision) && precision >= 0) {
    const factor = 10 ** precision
    return Math.round(value * factor) / factor
  }
}
