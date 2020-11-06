import { getMonthIncrements } from '../ActivityTimelineScrubberUtils'

describe('Unit tests for ActivityTimelineScrubber', () => {
  test('Ensure that for different inputs, getMonthIncrements returns correct value', async () => {
    expect(getMonthIncrements(1608883200000, 1598338800000)).toEqual([
      1608883200000,
      1606291200000,
      1603612800000,
      1601020800000,
      1598342400000
    ])
    expect(getMonthIncrements(1583996400000, 1568271600000)).toEqual([
      1583996400000,
      1581490800000,
      1578812400000,
      1576134000000,
      1573542000000,
      1570863600000,
      1568271600000
    ])
    expect(getMonthIncrements(1577865600000, 1568271600000)).toEqual([
      1577865600000,
      1575187200000,
      1572595200000,
      1569916800000,
      1568271600000
    ])
    expect(getMonthIncrements(1577865600000, 1578816000000)).toEqual([1577865600000])
    expect(getMonthIncrements(1582617600000, 1578816000000)).toEqual([1582617600000, 1579939200000])
  })
})
