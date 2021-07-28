import { Connectors } from '@connectors/constants'
import type { MonitoredServiceRef } from '@cv/pages/monitored-service/component/MonitoredService.types'
import type { AppDynamicsHealthSourceSpec } from 'services/cv'
import { GCOProduct } from '../connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.utils'
import type { RowData, SourceDataInterface, UpdatedHealthSource } from './HealthSourceDrawerContent.types'

const getValueBySourceType = (type: string, rowData: RowData) => {
  switch (type) {
    case Connectors.APP_DYNAMICS:
      return getAppDFields(rowData)
    default:
      break
  }
}

export const getAppDFields = (rowData: RowData) => {
  return {
    product: (rowData?.spec as AppDynamicsHealthSourceSpec)?.feature,
    applicationName: (rowData?.spec as AppDynamicsHealthSourceSpec)?.applicationName,
    tierName: (rowData?.spec as AppDynamicsHealthSourceSpec)?.tierName,
    metricPacks: (rowData?.spec as AppDynamicsHealthSourceSpec)?.metricPacks
  }
}

export function addProductFieldToStackdriverMetrics(healthSources?: UpdatedHealthSource[]): void {
  for (const healthSource of healthSources || []) {
    if (healthSource?.type !== 'Stackdriver') {
      continue
    }
    ;(healthSource.spec as any).feature = GCOProduct.CLOUD_METRICS
    ;(healthSource.spec as any).product = {
      label: GCOProduct.CLOUD_METRICS,
      value: GCOProduct.CLOUD_METRICS
    }
    return
  }
}

export const createHealthSourceDrawerFormData = ({
  isEdit,
  monitoredServiceRef,
  serviceRef,
  environmentRef,
  tableData,
  rowData
}: {
  isEdit: boolean
  monitoredServiceRef: MonitoredServiceRef
  serviceRef: string
  environmentRef: string
  tableData: Array<RowData>
  rowData?: RowData | null
}): SourceDataInterface => {
  let sourceData: SourceDataInterface = {
    isEdit,
    healthSourceList: tableData,
    serviceRef,
    environmentRef,
    monitoredServiceRef
  }

  if (isEdit) {
    if (!rowData) return sourceData
    addProductFieldToStackdriverMetrics(sourceData.healthSourceList)
    const sourceTypeValue = getValueBySourceType(rowData?.type || '', rowData)
    sourceData = {
      ...sourceData,
      ...sourceTypeValue,
      healthSourceName: rowData?.name,
      healthSourceIdentifier: rowData?.identifier,
      sourceType: rowData?.type,
      connectorRef: rowData?.spec?.connectorRef
    }
  }

  return sourceData
}
