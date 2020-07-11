import type { NewRelicApplication, MetricPack, DSConfig } from '@wings-software/swagger-ts/definitions'
import type { SelectOption, MultiSelectOption } from '@wings-software/uikit'
import type { TierAndServiceRow } from './TierAndServiceTable/TierAndServiceTable'

export interface AppDynamicsDSConfig extends DSConfig {
  applicationName?: string
  serviceMappings: Array<{ tierName: string; serviceIdentifier: string }>
  metricPacks: MetricPack[]
}

export interface DSConfigTableData extends AppDynamicsDSConfig {
  tableData: TierAndServiceRow[]
  metricPackList: MultiSelectOption[]
}

export function createDefaultConfigObjectBasedOnSelectedApps(
  app: SelectOption,
  dataSourceId: string,
  accountId: string,
  productName: string
): DSConfigTableData {
  return createDefaultConfigObject(dataSourceId, accountId, app.label, productName)
}

export function createDefaultConfigObject(
  connectorId: string,
  accountId: string,
  appName: string,
  productName: string
): DSConfigTableData {
  return {
    connectorId,
    type: 'APP_DYNAMICS',
    accountId,
    metricPacks: [],
    serviceMappings: [],
    metricPackList: [],
    tableData: [],
    envIdentifier: '',
    projectIdentifier: 'harness',
    productName,
    identifier: '',
    applicationName: appName
  }
}

export function transformAppDynamicsApplications(appdApplications: NewRelicApplication[]): SelectOption[] {
  return (
    appdApplications
      ?.filter((app: NewRelicApplication) => app?.name)
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
    transformedConfig.tableData = serviceMappings?.map(serviceMapping => ({
      tierName: serviceMapping.tierName,
      service: serviceMapping.serviceIdentifier,
      selected: true
    }))

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
  clonedConfig.serviceMappings = []
  clonedConfig.identifier = clonedConfig.applicationName
  for (const tableRow of tableData) {
    if (tableRow.selected && tableRow.service && tableRow.tierName) {
      clonedConfig.serviceMappings.push({ tierName: tableRow.tierName, serviceIdentifier: tableRow.service })
    }
  }

  return clonedConfig
}
