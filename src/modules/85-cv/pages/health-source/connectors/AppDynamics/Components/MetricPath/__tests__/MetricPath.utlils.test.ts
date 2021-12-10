import type { IconName } from '@wings-software/uicore'
import { onMetricPathChange } from '../MetricPath.utils'

describe('Validate utils', () => {
  test('onMetricPathChange', () => {
    const metriPathSelectOption = {
      label: 'Number of Slow Calls',
      value: 'Number of Slow Calls',
      icon: { name: 'main-like' as IconName }
    }
    expect(
      onMetricPathChange(metriPathSelectOption, 1, {
        metricPathDropdown_0: { value: 'Thread Tasks', path: '', isMetric: false },
        metricPathDropdown_1: { value: 'HealthService$$Lambda$', path: 'Thread Tasks', isMetric: false },
        metricPathDropdown_2: {
          value: 'Number of Slow Calls',
          path: 'Thread Tasks|HealthService$$Lambda$',
          isMetric: true
        },
        metricPathDropdown_3: {
          value: '',
          path: 'Thread Tasks|HealthService$$Lambda$|Number of Slow Calls',
          isMetric: false
        }
      })
    ).toEqual({
      metricPathDropdown_0: {
        isMetric: false,
        path: '',
        value: 'Thread Tasks'
      },
      metricPathDropdown_1: {
        isMetric: true,
        path: 'Thread Tasks',
        value: 'Number of Slow Calls'
      },
      metricPathDropdown_2: {
        isMetric: false,
        path: 'Thread Tasks|Number of Slow Calls',
        value: ''
      }
    })
  })
})