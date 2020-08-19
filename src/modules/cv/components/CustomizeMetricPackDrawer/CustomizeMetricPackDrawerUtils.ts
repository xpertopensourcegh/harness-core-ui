import type { MetricPack } from '@wings-software/swagger-ts/definitions'
import { mapCriteriaToRequest, mapCriteriaSignToForm } from 'modules/cv/pages/metric-pack/ConfigureThresholdUtils'

export const ThresholdAction = {
  IGNORE: 'ignore',
  FAIL: 'fail'
}

export function transformMetricPackToThresholds(metricPack: any): { failFastHints: any[]; ignoreHints: any[] } {
  const ignoreHints: any[] = []
  const failFastHints: any[] = []
  for (const metric of metricPack?.metrics || []) {
    if (!metric.included) {
      continue
    }
    for (const threshold of metric.thresholds || []) {
      const { criteria, occurrenceCount, type } = threshold.criteria || {}
      if (threshold.action === ThresholdAction.IGNORE) {
        ignoreHints.push({
          name: metric.name,
          action: ThresholdAction.IGNORE,
          criteria: parseInt(criteria?.split(' ')[1] || ''),
          criteriaOptions: mapCriteriaSignToForm(criteria || ''),
          occurrenceCount,
          type
        })
      } else if (threshold.action === ThresholdAction.FAIL) {
        failFastHints.push({
          name: metric.name,
          action: threshold.criteria?.action,
          criteria: parseInt(criteria?.split(' ')[1] || ''),
          criteriaOptions: mapCriteriaSignToForm(criteria || ''),
          occurrenceCount,
          type
        })
      }
    }
  }

  return { failFastHints, ignoreHints }
}

export function updateMetricPackHints(values: any, selectedThresholdMetricPack: any): MetricPack {
  const metricThresholds = new Map<string, any>()
  for (const metric of selectedThresholdMetricPack.metrics || []) {
    if (metric.name) {
      metric.thresholds = []
      metricThresholds.set(metric.name, metric)
    }
  }

  for (const ignoreThreshold of values?.metrics?.ignoreMetrics || []) {
    const metric = metricThresholds.get(ignoreThreshold.name)
    if (ignoreThreshold && metric?.thresholds) {
      metric.thresholds.push({
        action: ThresholdAction.IGNORE,
        criteria: {
          value: ignoreThreshold.criteria,
          type: ignoreThreshold.type,
          criteria: mapCriteriaToRequest(ignoreThreshold.criteria, ignoreThreshold.criteriaOptions)
        }
      })
    }
  }

  for (const failFastThreshold of values?.metrics.failMetrics || []) {
    const metric = metricThresholds.get(failFastThreshold.name)
    if (failFastThreshold && metric?.thresholds) {
      metric.thresholds.push({
        action: ThresholdAction.FAIL,
        criteria: {
          value: failFastThreshold.criteria,
          occurrenceCount: failFastThreshold.occurrenceCount,
          action: failFastThreshold.action,
          type: failFastThreshold.type,
          criteria: mapCriteriaToRequest(failFastThreshold.criteria, failFastThreshold.criteriaOptions)
        }
      })
    }
  }

  return { ...selectedThresholdMetricPack }
}
