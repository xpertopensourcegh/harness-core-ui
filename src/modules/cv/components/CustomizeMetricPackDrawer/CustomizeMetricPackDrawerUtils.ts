import type { MetricPack, MetricDefinition } from '@wings-software/swagger-ts/definitions'
import { mapCriteriaToRequest, mapCriteriaSignToForm } from 'modules/cv/pages/metric-pack/ConfigureThresholdUtils'

export function transformMetricPackToThresholds(metricPack: MetricPack): { failFastHints: any[]; ignoreHints: any[] } {
  const ignoreHints: any[] = []
  const failFastHints: any[] = []
  for (const metric of metricPack?.metrics || []) {
    if (!metric.included) {
      continue
    }
    if (metric?.failFastHints?.length) {
      for (const hint of metric.failFastHints) {
        failFastHints.push({
          name: metric.name,
          action: hint.action,
          criteria: parseInt(hint.criteria?.split(' ')[1] || ''),
          criteriaOptions: mapCriteriaSignToForm(hint.criteria || ''),
          occurrenceCount: hint.occurrenceCount,
          type: hint.type
        })
      }
    }
    if (metric?.ignoreHints?.length) {
      for (const hint of metric.ignoreHints) {
        ignoreHints.push({
          name: metric.name,
          action: 'ignore',
          criteria: parseInt(hint.criteria?.split(' ')[1] || ''),
          criteriaOptions: mapCriteriaSignToForm(hint.criteria || ''),
          occurrenceCount: hint.occurrenceCount,
          type: hint.type
        })
      }
    }
  }

  return { failFastHints, ignoreHints }
}

export function updateMetricPackHints(values: any, selectedThresholdMetricPack: MetricPack): MetricPack {
  const metricThresholds = new Map<string, MetricDefinition>()
  for (const metric of selectedThresholdMetricPack.metrics || []) {
    if (metric.name) {
      metric.failFastHints = []
      metric.ignoreHints = []
      metricThresholds.set(metric.name, metric)
    }
  }

  for (const ignoreThreshold of values?.metrics?.ignoreMetrics || []) {
    const metric = metricThresholds.get(ignoreThreshold.name)
    if (ignoreThreshold && metric?.ignoreHints) {
      metric.ignoreHints.push({
        criteria: mapCriteriaToRequest(ignoreThreshold.criteria, ignoreThreshold.criteriaOptions),
        occurrenceCount: ignoreThreshold.occurrenceCount,
        type: ignoreThreshold.type
      })
    }
  }

  for (const failFastThreshold of values?.metrics.failMetrics || []) {
    const metric = metricThresholds.get(failFastThreshold.name)
    if (failFastThreshold && metric?.failFastHints) {
      metric.failFastHints.push({
        action: failFastThreshold.action,
        criteria: mapCriteriaToRequest(failFastThreshold.criteria, failFastThreshold.criteriaOptions),
        occurrenceCount: failFastThreshold.occurrenceCount,
        type: failFastThreshold.type
      })
    }
  }

  return { ...selectedThresholdMetricPack }
}
