import type { MetricThresholdType } from '@cv/pages/health-source/connectors/AppDynamics/AppDHealthSource.types'
import { MetricCriteriaValues, PercentageCriteriaDropdownValues } from '../MetricThresholds.constants'
import {
  getActionItems,
  getCriterialItems,
  getCriteriaPercentageDropdownOptions,
  getGroupDropdownOptions,
  isGroupTransationTextField,
  validateCommonFieldsForMetricThreshold
} from '../MetricThresholds.utils'
import {
  exceptionalGroupedCreatedMetrics,
  groupedCreatedMetrics,
  groupedCreatedMetricsDefault
} from './MetricThresholds.utils.mock'

describe('AppDIgnoreThresholdTabContent', () => {
  test('should test getCriterialItems', () => {
    const items = getCriterialItems(key => key)

    expect(items).toEqual([
      { label: 'cv.monitoringSources.appD.absoluteValue', value: 'Absolute' },
      { label: 'cv.monitoringSources.appD.percentageDeviation', value: 'Percentage' }
    ])
  })
  test('should test getCriteriaPercentageDropdownOptions', () => {
    const items = getCriteriaPercentageDropdownOptions(key => key)

    expect(items).toEqual([
      { label: 'cv.monitoringSources.appD.greaterThan', value: 'greaterThan' },
      { label: 'cv.monitoringSources.appD.lesserThan', value: 'lessThan' }
    ])
  })

  test('should test isGroupTransationTextField', () => {
    expect(isGroupTransationTextField('Performance')).toBe(true)
    expect(isGroupTransationTextField('Errors')).toBe(true)
    expect(isGroupTransationTextField('Custom')).toBe(false)
  })

  test('should validate getActionItems', () => {
    expect(getActionItems(key => key)).toEqual([
      { label: 'cv.monitoringSources.appD.failImmediately', value: 'FailImmediately' },
      { label: 'cv.monitoringSources.appD.failAfterMultipleOccurrences', value: 'FailAfterOccurrence' },
      { label: 'cv.monitoringSources.appD.failAfterConsecutiveOccurrences', value: 'FailAfterConsecutiveOccurrence' }
    ])
  })

  test('should validate getGroupDropdownOptions', () => {
    expect(getGroupDropdownOptions(groupedCreatedMetrics)).toEqual([{ label: 'group 1', value: 'group 1' }])
  })

  test('should validate getGroupDropdownOptions for default group name', () => {
    expect(getGroupDropdownOptions(groupedCreatedMetricsDefault)).toEqual([])
  })

  test('should validate getGroupDropdownOptions for default group name', () => {
    expect(getGroupDropdownOptions(exceptionalGroupedCreatedMetrics)).toEqual([])
  })

  test('should check validateCommonFieldsForMetricThreshold', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: undefined,
      groupName: undefined,
      metricName: undefined,
      type: undefined,
      spec: {
        action: 'Ignore',
        spec: {}
      },
      criteria: {
        type: undefined,
        spec: {}
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({
      'ignoreThresholds.0.criteria.type': 'cv.metricThresholds.validations.criteria',
      'ignoreThresholds.0.groupName': 'cv.metricThresholds.validations.groupTransaction',
      'ignoreThresholds.0.metricName': 'cv.metricThresholds.validations.metricName',
      'ignoreThresholds.0.metricType': 'cv.metricThresholds.validations.metricType'
    })
  })

  test('should not check group validation if isValidateGroup parameter is sent as false', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: undefined,
      groupName: undefined,
      metricName: undefined,
      type: undefined,
      spec: {
        action: 'Ignore',
        spec: {}
      },
      criteria: {
        type: undefined,
        spec: {}
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, false)
    expect(errors).toEqual({
      'ignoreThresholds.0.criteria.type': 'cv.metricThresholds.validations.criteria',
      'ignoreThresholds.0.metricName': 'cv.metricThresholds.validations.metricName',
      'ignoreThresholds.0.metricType': 'cv.metricThresholds.validations.metricType'
    })
  })
  test('should check validateCommonFieldsForMetricThreshold for greater than and less than', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'IgnoreThreshold',
      spec: {
        action: 'FailImmediately',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Absolute,
        spec: {}
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({
      'ignoreThresholds.0.criteria.spec.greaterThan': 'cv.required',
      'ignoreThresholds.0.criteria.spec.lessThan': 'cv.required'
    })
  })

  test('should check validateCommonFieldsForMetricThreshold for greater than should be smaller than less than', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailImmediately',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Absolute,
        spec: {
          greaterThan: 10,
          lessThan: 5
        }
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({
      'ignoreThresholds.0.criteria.spec.greaterThan': 'cv.metricThresholds.validations.greaterThanSmaller',
      'ignoreThresholds.0.criteria.spec.lessThan': 'cv.metricThresholds.validations.lessThanBigger'
    })
  })

  test('should check validateCommonFieldsForMetricThreshold for greater than and less than are non mandatory fields - greater than empty', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailImmediately',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Absolute,
        spec: {
          greaterThan: 10
        }
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({})
  })

  test('should check validateCommonFieldsForMetricThreshold for greater than and less than are non mandatory fields - less than empty', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailImmediately',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Absolute,
        spec: {
          lessThan: 10
        }
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({})
  })

  test('should check validateCommonFieldsForMetricThreshold for percentage criteria', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailImmediately',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Percentage,
        criteriaPercentageType: PercentageCriteriaDropdownValues.GreaterThan,
        spec: {}
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({ 'ignoreThresholds.0.criteria.spec.greaterThan': 'cv.required' })
  })

  test('should check validateCommonFieldsForMetricThreshold for percentage criteria', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailImmediately',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Percentage,
        criteriaPercentageType: PercentageCriteriaDropdownValues.LessThan,
        spec: {}
      }
    }
    validateCommonFieldsForMetricThreshold('ignoreThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({ 'ignoreThresholds.0.criteria.spec.lessThan': 'cv.required' })
  })

  test('should check validateCommonFieldsForMetricThreshold for count', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailAfterOccurrence',
        spec: {}
      },
      criteria: {
        type: MetricCriteriaValues.Percentage,
        criteriaPercentageType: PercentageCriteriaDropdownValues.LessThan,
        spec: {
          lessThan: 10
        }
      }
    }
    validateCommonFieldsForMetricThreshold('failFastThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({ 'failFastThresholds.0.spec.spec.count': 'cv.required' })
  })

  test('should check validateCommonFieldsForMetricThreshold for count', () => {
    const errors = {}
    const testValue: MetricThresholdType = {
      metricType: 'test',
      groupName: 'test',
      metricName: 'test',
      type: 'FailImmediately',
      spec: {
        action: 'FailAfterOccurrence',
        spec: {
          count: 1
        }
      },
      criteria: {
        type: MetricCriteriaValues.Percentage,
        criteriaPercentageType: PercentageCriteriaDropdownValues.LessThan,
        spec: {
          lessThan: 10
        }
      }
    }
    validateCommonFieldsForMetricThreshold('failFastThresholds', errors, [testValue], key => key, true)
    expect(errors).toEqual({ 'failFastThresholds.0.spec.spec.count': 'cv.metricThresholds.validations.countValue' })
  })
})
