import { createAppDynamicsData } from '../AppDHealthSource.utils'
import { sourceData, expectedAppDynamicData } from './AppDMonitoredSource.mock'

describe('Test AppDynamics Utils', () => {
  test('Verify createAppDynamicsData', () => {
    expect(createAppDynamicsData(sourceData)).toEqual(expectedAppDynamicData)
  })
})
