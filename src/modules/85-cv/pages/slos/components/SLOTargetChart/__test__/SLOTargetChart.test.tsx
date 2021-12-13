import type { Point } from 'services/cv'
import { getDataPointsWithMinMaxXLimit } from '../SLOTargetChart.utils'

describe('SLOTargetChart Utils', () => {
  test('Should return min and max values without rounding', () => {
    const dataPoints: Point[] = [
      {
        timestamp: 101,
        value: 90
      },
      {
        timestamp: 105,
        value: 80
      },
      {
        timestamp: 110,
        value: 85
      }
    ]

    expect(getDataPointsWithMinMaxXLimit(dataPoints)).toStrictEqual({
      dataPoints: [
        [101, 90],
        [105, 80],
        [110, 85]
      ],
      minXLimit: 80,
      maxXLimit: 90
    })
  })

  test('Should return min and max values by rounding', () => {
    const dataPoints: Point[] = [
      {
        timestamp: 101,
        value: 98
      },
      {
        timestamp: 105,
        value: 82
      }
    ]

    expect(getDataPointsWithMinMaxXLimit(dataPoints)).toStrictEqual({
      dataPoints: [
        [101, 98],
        [105, 82]
      ],
      minXLimit: 80,
      maxXLimit: 100
    })
  })

  test('Should handle NaN and string types', () => {
    const dataPoints: Point[] = [
      {
        timestamp: NaN,
        value: NaN
      },
      {
        timestamp: 105,
        value: 82
      },
      {
        timestamp: 'NaN' as unknown as number,
        value: 'NaN' as unknown as number
      }
    ]

    expect(getDataPointsWithMinMaxXLimit(dataPoints)).toStrictEqual({
      dataPoints: [
        [0, 0],
        [105, 82],
        [0, 0]
      ],
      minXLimit: 0,
      maxXLimit: 90
    })
  })
})
