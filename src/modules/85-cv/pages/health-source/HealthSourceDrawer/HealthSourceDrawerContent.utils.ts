import type { SelectOption } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import type { AppDynamicsHealthSourceSpec } from 'services/cv'
import type { RowData, SourceDataInterface } from './HealthSourceDrawerContent.types'

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

export const createHealthSourceDrawerFormData = (
  isEdit: boolean,
  monitoringSourcRef: { monitoredServiceIdentifier: string; monitoredServiceName: string },
  serviceRef: SelectOption | undefined,
  environmentRef: SelectOption | undefined,
  tableData: Array<RowData>,
  rowData?: RowData | null
): SourceDataInterface => {
  let sourceData: SourceDataInterface = {
    isEdit,
    healthSourceList: tableData,
    environmentName: environmentRef?.label as string,
    environmentIdentifier: environmentRef?.value as string,
    serviceName: serviceRef?.label as string,
    serviceIdentifier: serviceRef?.value as string,
    monitoringSourceName: monitoringSourcRef?.monitoredServiceName,
    monitoredServiceIdentifier: monitoringSourcRef?.monitoredServiceIdentifier
  }

  if (isEdit) {
    if (!rowData) return sourceData
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
