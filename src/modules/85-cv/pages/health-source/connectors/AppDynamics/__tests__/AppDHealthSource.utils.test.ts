import * as uuid from 'uuid'
import {
  validateMapping,
  createAppDFormData,
  createAppDynamicsPayload,
  initializeCreatedMetrics,
  initializeNonCustomFields,
  initializeSelectedMetricsMap,
  convertMetricPackToMetricData,
  convertStringMetricPathToObject,
  convertStringBasePathToObject
} from '../AppDHealthSource.utils'
import {
  appDMetricValue,
  expectedAppDynamicData,
  formData,
  formDataExpectedOutput,
  formikInitialData,
  nonCustomFeilds,
  validateMappingNoError,
  validateMappingWithErrors,
  validateMappingWithMetricPathError
} from './AppDMonitoredSource.mock'

jest.mock('uuid')
describe('Test Util funcitons', () => {
  test('should validate validateMapping No Error', () => {
    expect(
      validateMapping(validateMappingNoError, ['appdMetric Two', 'appdMetric One Updated'], 0, val => val)
    ).toEqual({})
  })
  test('should validate validateMapping All Errors', () => {
    expect(
      validateMapping(validateMappingWithErrors, ['appdMetric Two', 'appdMetric One Updated'], 0, val => val)
    ).toEqual({
      appDTier: 'cv.healthSource.connectors.AppDynamics.validation.tier',
      appdApplication: 'cv.healthSource.connectors.AppDynamics.validation.application',
      basePath: 'cv.healthSource.connectors.AppDynamics.validation.basePath',
      lowerBaselineDeviation: 'cv.monitoringSources.prometheus.validation.deviation',
      metricName: 'cv.monitoringSources.metricNameValidation',
      metricPath: 'cv.healthSource.connectors.AppDynamics.validation.metricPath',
      riskCategory: 'cv.monitoringSources.gco.mapMetricsToServicesPage.validation.riskCategory'
    })
    expect(
      validateMapping(validateMappingWithMetricPathError, ['appdMetric Two', 'appdMetric One Updated'], 0, val => val)
    ).toEqual({ metricPath: 'cv.healthSource.connectors.AppDynamics.validation.metricPathWithoutLeafNode' })
  })

  test('should validate createAppDynamicsPayload', () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('MockedUUID')
    expect(createAppDynamicsPayload(formData)).toEqual(formDataExpectedOutput)
  })

  test('should validate initializeNonCustomFields', () => {
    expect(initializeNonCustomFields(expectedAppDynamicData as any)).toEqual(nonCustomFeilds)
  })

  test('should validate createAppDFormData', () => {
    const { selectedMetric, mappedMetrics } = initializeSelectedMetricsMap(
      'defaultAppDMetricName',
      expectedAppDynamicData?.mappedServicesAndEnvs
    )
    const mappedServicesAndEnvs = new Map()
    mappedServicesAndEnvs.set('appdMetric', appDMetricValue)
    expect(selectedMetric).toEqual('appdMetric')
    expect(mappedMetrics).toEqual(mappedServicesAndEnvs)

    const { createdMetrics, selectedMetricIndex } = initializeCreatedMetrics(
      'defaultAppDMetricName',
      selectedMetric,
      mappedMetrics
    )

    expect(createdMetrics).toEqual(['appdMetric'])
    expect(selectedMetricIndex).toEqual(0)

    expect(
      createAppDFormData(expectedAppDynamicData as any, mappedMetrics, selectedMetric, nonCustomFeilds, true)
    ).toEqual(formikInitialData)
  })

  test('should validate convertMetricPackToMetricData', () => {
    expect(convertMetricPackToMetricData([{ identifier: 'Performance' }, { identifier: 'Errors' }])).toEqual({
      Errors: true,
      Performance: true
    })
  })

  test('should validate convertStringBasePathTo and convertStringMetricPathTo', () => {
    expect(convertStringBasePathToObject('Application Infrastructure Performance|cvng')).toEqual({
      basePathDropdown_0: {
        path: '',
        value: 'Application Infrastructure Performance'
      },
      basePathDropdown_1: {
        path: 'Application Infrastructure Performance',
        value: 'cvng'
      },
      basePathDropdown_2: {
        path: 'Application Infrastructure Performance|cvng',
        value: ''
      }
    })

    expect(convertStringMetricPathToObject('performance|call per minute')).toEqual({
      metricPathDropdown_0: {
        path: '',
        isMetric: false,
        value: 'performance'
      },
      metricPathDropdown_1: {
        path: 'performance',
        isMetric: true,
        value: 'call per minute'
      },
      metricPathDropdown_2: {
        isMetric: false,
        path: 'performance|call per minute',
        value: ''
      }
    })
  })
})
