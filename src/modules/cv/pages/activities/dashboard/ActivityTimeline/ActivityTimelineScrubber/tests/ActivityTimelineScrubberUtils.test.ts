import { getMonthIncrements } from '../ActivityTimelineScrubberUtils'

describe('Unit tests for ActivityTimelineScrubber', () => {
  test('Ensure that for different inputs, getMonthIncrements returns correct value', async () => {
    expect(getMonthIncrements(1608883200000, 1598338800000)).toEqual(['Dec', 'Nov', 'Oct', 'Sep', 'Aug'])
    expect(getMonthIncrements(1583996400000, 1568271600000)).toEqual(['Mar', 'Feb', 'Jan', 'Dec', 'Nov', 'Oct', 'Sep'])
    expect(getMonthIncrements(1577865600000, 1568271600000)).toEqual(['Jan', 'Dec', 'Nov', 'Oct', 'Sep'])
    expect(getMonthIncrements(1577865600000, 1578816000000)).toEqual(['Jan'])
    expect(getMonthIncrements(1582617600000, 1578816000000)).toEqual(['Feb', 'Jan'])
  })
})
