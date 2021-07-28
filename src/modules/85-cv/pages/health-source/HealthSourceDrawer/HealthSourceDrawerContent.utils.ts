import type { MonitoredServiceRef } from '@cv/pages/monitored-service/component/MonitoredService.types'
import { GCOProduct } from '../connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.utils'
import type { RowData, SourceDataInterface, UpdatedHealthSource } from './HealthSourceDrawerContent.types'

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
    sourceData = {
      ...sourceData,
      healthSourceName: rowData?.name,
      healthSourceIdentifier: rowData?.identifier,
      sourceType: rowData?.type,
      connectorRef: rowData?.spec?.connectorRef
    }
  }

  return sourceData
}
