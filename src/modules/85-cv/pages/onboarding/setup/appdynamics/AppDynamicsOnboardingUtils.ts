import type { SelectOption, MultiSelectOption } from '@wings-software/uikit'
import type { DSConfig, MetricPack } from 'services/cv'
import type { TierAndServiceRow } from './TierAndServiceTable/TierAndServiceTable'

export interface AppDynamicsDSConfig extends DSConfig {
  applicationName?: string
  serviceMappings: Array<{ tierName: string; serviceIdentifier: string }>
  metricPacks: MetricPack[]
}

export interface DSConfigTableData extends AppDynamicsDSConfig {
  tableData?: TierAndServiceRow[]
  metricPackList?: MultiSelectOption[]
  services?: MultiSelectOption[]
}

export function createDefaultConfigObjectBasedOnSelectedApps(
  app: SelectOption,
  dataSourceId: string,
  accountId: string,
  productName: string,
  projectIdentifier: string,
  orgIdentifier: string
): DSConfigTableData {
  return createDefaultConfigObject(dataSourceId, accountId, app.label, productName, projectIdentifier, orgIdentifier)
}

export function createDefaultConfigObject(
  connectorId: string,
  accountId: string,
  appName: string,
  productName: string,
  projectIdentifier: string,
  orgIdentifier: string
): DSConfigTableData {
  return {
    connectorIdentifier: connectorId,
    type: 'APP_DYNAMICS',
    accountId,
    metricPacks: [],
    serviceMappings: [],
    metricPackList: [],
    tableData: [],
    projectIdentifier,
    orgIdentifier,
    productName,
    identifier: '',
    applicationName: appName
  }
}

export function transformAppDynamicsApplications(appdApplications: any[]): SelectOption[] {
  return (
    appdApplications
      ?.filter((app: any) => app?.name)
      .sort((a, b) => (a.name && b.name && a.name > b.name ? 1 : -1))
      .map(({ name, id }) => ({ label: name || '', value: id || '' })) || []
  )
}

export function transformGetConfigs(appDConfigs: AppDynamicsDSConfig[]): DSConfigTableData[] {
  if (!appDConfigs?.length) {
    return []
  }

  const appsToAppDConfigs: DSConfigTableData[] = []
  for (const config of appDConfigs) {
    if (!config) {
      continue
    }

    const { serviceMappings = [], metricPacks = [] } = config
    const transformedConfig: DSConfigTableData = config as DSConfigTableData
    transformedConfig.services = []
    transformedConfig.tableData = serviceMappings?.map(serviceMapping => {
      transformedConfig.services?.push({
        label: serviceMapping.serviceIdentifier,
        value: serviceMapping.serviceIdentifier
      })
      return {
        tierOption: { label: serviceMapping.tierName, value: -1 },
        serviceName: serviceMapping.serviceIdentifier
      }
    })

    transformedConfig.metricPackList = (metricPacks
      ?.filter(mp => mp && mp.identifier)
      .map(mp => ({ label: mp.identifier, value: mp.identifier })) || []) as MultiSelectOption[]
    appsToAppDConfigs.push(transformedConfig)
  }

  return appsToAppDConfigs
}

export function transformToSaveConfig(appDConfig: DSConfig): AppDynamicsDSConfig {
  const clonedConfig: DSConfigTableData = { ...appDConfig } as DSConfigTableData

  const { tableData = [] } = clonedConfig || {}

  // convert table data to list of configs to save
  delete clonedConfig.tableData
  delete clonedConfig.metricPackList
  delete clonedConfig.services
  clonedConfig.serviceMappings = []
  clonedConfig.identifier = clonedConfig.applicationName
  for (const tableRow of tableData) {
    if (tableRow.serviceName && tableRow.tierOption) {
      clonedConfig.serviceMappings.push({
        tierName: tableRow.tierOption.label,
        serviceIdentifier: tableRow.serviceName
      })
    }
  }

  return clonedConfig
}
