import { isEmpty } from 'lodash-es'
import type {
  DatadogAggregationType,
  DatadogMetricInfo,
  DatadogMetricSetupSource
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.type'
import type { UpdatedHealthSource } from '@cv/pages/health-source/HealthSourceDrawer/HealthSourceDrawerContent.types'
import type {
  DatadogDashboardDetail,
  DatadogDashboardDTO,
  DatadogMetricHealthDefinition,
  DatadogMetricHealthSourceSpec,
  RiskProfile
} from 'services/cv'
import { HealthSourceTypes } from '@cv/pages/health-source/types'
import type { StringKeys } from 'framework/strings'
import { OVERALL } from '@cv/pages/health-source/connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.constants'
import type {
  MetricDashboardItem,
  MetricWidget
} from '@cv/components/MetricDashboardWidgetNav/MetricDashboardWidgetNav.type'
import type { SelectedWidgetMetricData } from '@cv/components/CloudMetricsHealthSource/CloudMetricsHealthSource.type'
import { MANUAL_INPUT_QUERY } from '@cv/pages/health-source/connectors/GCOMetricsHealthSource/components/ManualInputQueryModal/ManualInputQueryModal'
import {
  DatadogMetricsQueryBuilder,
  DatadogMetricsQueryExtractor
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/components/DatadogMetricsDetailsContent/DatadogMetricsDetailsContent.utils'

export const DatadogProduct = {
  CLOUD_METRICS: 'Datadog Cloud Metrics',
  CLOUD_LOGS: 'Datadog Cloud Logs'
}

export function mapDatadogMetricHealthSourceToDatadogMetricSetupSource(sourceData: any): DatadogMetricSetupSource {
  const healthSource: UpdatedHealthSource = sourceData?.healthSourceList?.find(
    (source: UpdatedHealthSource) => source.name === sourceData.healthSourceName
  )

  const setupSource: DatadogMetricSetupSource = {
    selectedDashboards: sourceData.selectedDashboards || [],
    metricDefinition: sourceData.metricDefinition || new Map(),
    isEdit: sourceData.isEdit,
    healthSourceName: sourceData.healthSourceName,
    healthSourceIdentifier: sourceData.healthSourceIdentifier,
    connectorRef: sourceData.connectorRef,
    product: sourceData.product
  }

  if (!healthSource) {
    return setupSource
  }

  const datadogMetricSpec: DatadogMetricHealthSourceSpec = (healthSource.spec as DatadogMetricHealthSourceSpec) || {}

  for (const metricDefinition of datadogMetricSpec.metricDefinitions || []) {
    const manualQuery = metricDefinition?.isManualQuery
    if (
      !metricDefinition?.metricName ||
      ((!metricDefinition.dashboardName || !metricDefinition.dashboardId) && !manualQuery)
    ) {
      continue
    }

    if (!sourceData.selectedDashboards?.length) {
      setupSource.selectedDashboards.push({
        name: metricDefinition.dashboardName,
        id: metricDefinition.dashboardId
      })
    }
    setupSource.metricDefinition.set(metricDefinition.metricName, {
      metricName: metricDefinition.metricName,
      aggregator: metricDefinition.aggregation as DatadogAggregationType,
      metric: metricDefinition.metric,
      groupName: metricDefinition.dashboardName
        ? {
            label: metricDefinition.dashboardName,
            value: metricDefinition.dashboardName
          }
        : undefined,
      metricTags: metricDefinition.metricTags?.map(metricTag => {
        return { label: metricTag, value: metricTag }
      }),
      id: metricDefinition.dashboardId,
      isManualQuery: manualQuery,
      riskCategory: `${metricDefinition.riskProfile?.category}/${metricDefinition.riskProfile?.metricType}`,
      higherBaselineDeviation: metricDefinition.riskProfile?.thresholdTypes?.includes('ACT_WHEN_HIGHER'),
      lowerBaselineDeviation: metricDefinition.riskProfile?.thresholdTypes?.includes('ACT_WHEN_LOWER'),
      query: metricDefinition.query,
      groupingQuery: metricDefinition.groupingQuery,
      serviceInstanceIdentifierTag: metricDefinition.serviceInstanceIdentifierTag
    })
  }

  return setupSource
}

export function mapDatadogMetricSetupSourceToDatadogHealthSource(
  setupSource: DatadogMetricSetupSource
): UpdatedHealthSource {
  const healthSource: UpdatedHealthSource = {
    type: HealthSourceTypes.DatadogMetrics as UpdatedHealthSource['type'],
    identifier: setupSource.healthSourceIdentifier,
    name: setupSource.healthSourceName,
    spec: {
      connectorRef: setupSource.connectorRef,
      feature: DatadogProduct.CLOUD_METRICS,
      metricDefinitions: []
    }
  }
  for (const selectedMetricInfo of setupSource.metricDefinition) {
    const [selectedMetric, metricInfo] = selectedMetricInfo
    if (!selectedMetric || !metricInfo) {
      continue
    }
    const [category, metricType] = metricInfo.riskCategory?.split('/') || []

    const thresholdTypes: RiskProfile['thresholdTypes'] = []
    if (metricInfo.lowerBaselineDeviation) {
      thresholdTypes.push('ACT_WHEN_LOWER')
    }
    if (metricInfo.higherBaselineDeviation) {
      thresholdTypes.push('ACT_WHEN_HIGHER')
    }

    const spec: DatadogMetricHealthSourceSpec = (healthSource.spec as DatadogMetricHealthSourceSpec) || {}
    spec.metricDefinitions?.push({
      dashboardName: metricInfo.groupName?.value as string,
      dashboardId: metricInfo.id,
      metricName: metricInfo.metricName as string,
      metric: metricInfo.metric,
      metricTags: metricInfo.metricTags?.map(metricTag => metricTag.value as string),
      aggregation: metricInfo.aggregator,
      isManualQuery: metricInfo.isManualQuery,
      serviceInstanceIdentifierTag: metricInfo.serviceInstanceIdentifierTag,
      groupingQuery: metricInfo.groupingQuery,
      query: metricInfo.query,
      riskProfile: {
        metricType: metricType as RiskProfile['metricType'],
        category: category as RiskProfile['category'],
        thresholdTypes
      }
    } as DatadogMetricHealthDefinition)
  }

  return healthSource
}

export function validateFormMappings(
  values: DatadogMetricInfo,
  getString: (key: StringKeys) => string
): Record<string, any> {
  const errors: any = {}
  if (!values?.query?.length) {
    errors.query = getString('cv.monitoringSources.gco.manualInputQueryModal.validation.query')
  }
  if (!values.riskCategory) {
    errors.riskCategory = getString('cv.monitoringSources.gco.mapMetricsToServicesPage.validation.riskCategory')
  }
  if (!(values.higherBaselineDeviation || values.lowerBaselineDeviation)) {
    errors.higherBaselineDeviation = getString('cv.monitoringSources.gco.mapMetricsToServicesPage.validation.baseline')
  }
  if (!values.metricName?.length) {
    errors.metricName = getString('cv.monitoringSources.metricNameValidation')
  }
  if (!values.metric?.length) {
    errors.metric = getString('cv.monitoringSources.metricValidation')
  }
  if (!values.groupName?.label?.length) {
    errors.groupName = getString('cv.monitoringSources.prometheus.validation.groupName')
  }

  return errors
}

export function validate(
  values: DatadogMetricInfo,
  selectedMetrics: Map<string, DatadogMetricInfo>,
  getString: (key: StringKeys) => string
): { [key: string]: string } | undefined {
  const errors = validateFormMappings(values, getString)

  if (selectedMetrics.size === 1) {
    return errors
  }

  for (const entry of selectedMetrics) {
    const [, metricInfo] = entry
    if (metricInfo.metricName === values.metricName) {
      continue
    }
    if (isEmpty(validateFormMappings(metricInfo, getString))) {
      return errors
    }
  }

  if (!isEmpty(errors)) {
    errors[OVERALL] = getString('cv.monitoringSources.gco.mapMetricsToServicesPage.validation.mainSetupValidation')
  }

  return errors
}

export function getSelectedDashboards(data: any): MetricDashboardItem[] {
  return (
    data?.selectedDashboards
      ?.filter((dashboard: DatadogDashboardDTO) => dashboard.id)
      ?.map((dashboard: DatadogDashboardDTO) => {
        return {
          title: dashboard.name,
          itemId: dashboard.id
        }
      }) || []
  )
}

export function mapDatadogDashboardDetailToMetricWidget(datadogDashboardDetail: DatadogDashboardDetail): MetricWidget {
  return {
    widgetName: datadogDashboardDetail.widgetName || '',
    dataSets:
      datadogDashboardDetail.dataSets?.map(dataSet => {
        return {
          name: dataSet.name || '',
          query: dataSet.query || ''
        }
      }) || []
  }
}

export function mapSelectedWidgetDataToDatadogMetricInfo(
  selectedWidgetMetricData: SelectedWidgetMetricData,
  query: string,
  activeMetrics: string[]
): DatadogMetricInfo {
  const queryExtractor = DatadogMetricsQueryExtractor(query, activeMetrics || [])
  const queryBuilder = DatadogMetricsQueryBuilder(queryExtractor.activeMetric || '', queryExtractor.aggregation, [])
  return {
    metricName: selectedWidgetMetricData.metricName,
    metric: queryExtractor.activeMetric,
    aggregator: queryExtractor.aggregation,
    query: queryBuilder.query || query,
    isManualQuery: selectedWidgetMetricData.query === MANUAL_INPUT_QUERY,
    groupName: selectedWidgetMetricData?.dashboardTitle
      ? {
          label: selectedWidgetMetricData.dashboardTitle,
          value: selectedWidgetMetricData.dashboardTitle
        }
      : undefined,
    id: selectedWidgetMetricData.dashboardId
  }
}

export function getManuallyCreatedQueries(selectedMetrics: Map<string, DatadogMetricInfo>): string[] {
  if (!selectedMetrics?.size) {
    return []
  }
  const manualQueries: string[] = []
  for (const entry of selectedMetrics) {
    const [metricName, metricInfo] = entry
    if (metricName && metricInfo?.isManualQuery) {
      manualQueries.push(metricName)
    }
  }
  return manualQueries
}
