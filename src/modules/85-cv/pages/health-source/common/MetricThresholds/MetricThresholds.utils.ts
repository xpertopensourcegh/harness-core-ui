import type { UseStringsReturn } from 'framework/strings'
import type { MetricThresholdType } from '../../connectors/AppDynamics/AppDHealthSource.types'
import type { GroupedCreatedMetrics } from '../CustomMetric/CustomMetric.types'
import {
  DefaultCustomMetricGroupName,
  ExceptionGroupName,
  FailFastActionValues,
  MetricCriteriaValues,
  MetricThresholdPropertyName,
  MetricTypesForTransactionTextField,
  PercentageCriteriaDropdownValues
} from './MetricThresholds.constants'
import type { SelectItem } from './MetricThresholds.types'

export const getCriterialItems = (getString: UseStringsReturn['getString']): SelectItem[] => {
  return [
    {
      label: getString('cv.monitoringSources.appD.absoluteValue'),
      value: MetricCriteriaValues.Absolute
    },
    {
      label: getString('cv.monitoringSources.appD.percentageDeviation'),
      value: MetricCriteriaValues.Percentage
    }
  ]
}

export const getCriteriaPercentageDropdownOptions = (getString: UseStringsReturn['getString']): SelectItem[] => [
  {
    label: getString('cv.monitoringSources.appD.greaterThan'),
    value: PercentageCriteriaDropdownValues.GreaterThan
  },
  {
    label: getString('cv.monitoringSources.appD.lesserThan'),
    value: PercentageCriteriaDropdownValues.LessThan
  }
]

export function getActionItems(getString: UseStringsReturn['getString']): SelectItem[] {
  return [
    {
      label: getString('cv.monitoringSources.appD.failImmediately'),
      value: FailFastActionValues.FailImmediately
    },
    {
      label: getString('cv.monitoringSources.appD.failAfterMultipleOccurrences'),
      value: FailFastActionValues.FailAfterOccurrences
    },
    {
      label: getString('cv.monitoringSources.appD.failAfterConsecutiveOccurrences'),
      value: FailFastActionValues.FailAfterConsecutiveOccurrences
    }
  ]
}

export const isGroupTransationTextField = (selectedMetricType?: string | null): boolean =>
  MetricTypesForTransactionTextField.some(field => field === selectedMetricType)

export function getCustomMetricGroupNames(groupedCreatedMetrics: GroupedCreatedMetrics): string[] {
  const groupsNames = Object.keys(groupedCreatedMetrics)

  return groupsNames.filter(
    groupName => groupName !== '' && groupName !== DefaultCustomMetricGroupName && groupName !== ExceptionGroupName
  )
}

export function getGroupDropdownOptions(groupedCreatedMetrics: GroupedCreatedMetrics): SelectItem[] {
  const validGroups = getCustomMetricGroupNames(groupedCreatedMetrics)

  return validGroups.map(group => ({
    label: group,
    value: group
  }))
}

/**
 *  Common validation for thresholds
 *
 *  @param thresholdName determines whether ignoreThreshold or failImmediate
 *  @param errors error obj
 *  @param thresholdValues thresholds values to be validated
 *  @param getString YAML string function
 *  @param isValidateGroup flag which toggles group name validation
 *
 *
 */
export function validateCommonFieldsForMetricThreshold(
  thresholdName: string,
  errors: Record<string, string>,
  thresholdValues: MetricThresholdType[],
  getString: UseStringsReturn['getString'],
  isValidateGroup = false
): void {
  thresholdValues.forEach((value: MetricThresholdType, index: number) => {
    if (!value.metricType) {
      errors[`${thresholdName}.${index}.metricType`] = getString('cv.metricThresholds.validations.metricType')
    }
    if (!value.metricName) {
      errors[`${thresholdName}.${index}.metricName`] = getString('cv.metricThresholds.validations.metricName')
    }

    if (isValidateGroup && !value.groupName) {
      errors[`${thresholdName}.${index}.groupName`] = getString('cv.metricThresholds.validations.groupTransaction')
    }

    if (!value.criteria?.type) {
      errors[`${thresholdName}.${index}.criteria.type`] = getString('cv.metricThresholds.validations.criteria')
    }

    if (
      value.criteria?.type === MetricCriteriaValues.Absolute &&
      !value.criteria?.spec?.greaterThan &&
      !value.criteria?.spec?.lessThan
    ) {
      errors[`${thresholdName}.${index}.criteria.spec.greaterThan`] = getString('cv.required')
      errors[`${thresholdName}.${index}.criteria.spec.lessThan`] = getString('cv.required')
    }

    if (
      value.criteria?.type === MetricCriteriaValues.Absolute &&
      (value.criteria?.spec?.lessThan as number) <= (value.criteria?.spec?.greaterThan as number)
    ) {
      errors[`${thresholdName}.${index}.criteria.spec.lessThan`] = getString(
        'cv.metricThresholds.validations.lessThanBigger'
      )
      errors[`${thresholdName}.${index}.criteria.spec.greaterThan`] = getString(
        'cv.metricThresholds.validations.greaterThanSmaller'
      )
    }

    if (
      value.criteria?.type === MetricCriteriaValues.Percentage &&
      value?.criteria?.spec &&
      !value?.criteria?.spec[value?.criteria?.criteriaPercentageType as 'greaterThan' | 'lessThan']
    ) {
      errors[`${thresholdName}.${index}.criteria.spec.${value.criteria.criteriaPercentageType}`] =
        getString('cv.required')
    }

    if (thresholdName === MetricThresholdPropertyName.FailFastThresholds) {
      if (value.spec.action !== FailFastActionValues.FailImmediately && !value.spec.spec?.count) {
        errors[`${thresholdName}.${index}.spec.spec.count`] = getString('cv.required')
      }

      if (value.spec.action !== FailFastActionValues.FailImmediately && (value.spec?.spec?.count as number) <= 1) {
        errors[`${thresholdName}.${index}.spec.spec.count`] = getString('cv.metricThresholds.validations.countValue')
      }
    }
  })
}
