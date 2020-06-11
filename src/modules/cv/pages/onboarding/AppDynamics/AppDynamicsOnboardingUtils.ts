import type { NewRelicApplication, CVConfig, MetricPack } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'
import { CVNextGenCVConfigService } from '../../../services'
import type { TierAndServiceRow } from './TierAndServiceTable/TierAndServiceTable'

export interface AppDynamicsCVConfig extends CVConfig {
  applicationName?: string
  serviceMappings: Array<{ tierName: string; serviceIdentifier: string }>
  metricPacks: MetricPack[]
}

export interface CVConfigTableData extends AppDynamicsCVConfig {
  tableData?: TierAndServiceRow[]
  metricPackList?: string[]
}

export function createDefaultConfigObjectBasedOnSelectedApps(
  app: SelectOption,
  dataSourceId: string,
  accountId: string,
  productName: string
): CVConfigTableData {
  return createDefaultConfigObject(dataSourceId, accountId, app.label, app.value as number, productName)
}

export function createDefaultConfigObject(
  connectorId: string,
  accountId: string,
  appName: string,
  appId: number,
  productName: string
): CVConfigTableData {
  return {
    connectorId,
    type: 'APP_DYNAMICS',
    accountId,
    metricPacks: [],
    serviceMappings: [],
    metricPackList: [],
    name: '',
    envIdentifier: '',
    projectIdentifier: '',
    serviceId: '',
    productName,
    applicationId: appId,
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

export function transformGetConfigs(appDConfigs: AppDynamicsCVConfig[]): CVConfigTableData[] {
  if (!appDConfigs?.length) {
    return []
  }

  const appsToAppDConfigs: CVConfigTableData[] = []
  for (const config of appDConfigs) {
    if (!config) {
      continue
    }

    const { serviceMappings = [], metricPacks = [] } = config
    const transformedConfig: CVConfigTableData = config
    transformedConfig.tableData = serviceMappings?.map(serviceMapping => ({
      tierName: serviceMapping.tierName,
      service: serviceMapping.serviceIdentifier,
      selected: true
    }))

    transformedConfig.metricPackList = metricPacks?.map(mp => mp.name || '').filter(mpName => mpName.length) || []
    appsToAppDConfigs.push(transformedConfig)
  }

  return appsToAppDConfigs
}

export function transformToSaveConfig(appDConfig: CVConfigTableData): AppDynamicsCVConfig[] {
  const clonedConfig: CVConfigTableData = { ...appDConfig }

  const { tableData = [] } = clonedConfig || {}

  // convert table data to list of configs to save
  delete clonedConfig.tableData
  delete clonedConfig.metricPackList
  clonedConfig.serviceMappings = []
  for (const tableRow of tableData) {
    if (tableRow.selected && tableRow.service && tableRow.tierName) {
      clonedConfig.serviceMappings.push({ tierName: tableRow.tierName, serviceIdentifier: tableRow.service })
    }
  }

  return [clonedConfig]
}

export async function removeAppdConfig(accountId: string, idToDelete?: string): Promise<string | undefined> {
  if (!idToDelete) {
    return
  }
  const { error } = await CVNextGenCVConfigService.deleteConfigs({
    accountId,
    group: 'XHR_DELETE_CONFIG_GROUP',
    configsToDelete: [idToDelete]
  })
  return error ? error : undefined
}

export async function saveAppDConfig(
  appdConfig: CVConfigTableData,
  accountId: string
): Promise<{ error?: string; configsToShow: CVConfigTableData }> {
  const configsToSave = transformToSaveConfig(appdConfig)
  if (!configsToSave?.length) {
    return { configsToShow: appdConfig }
  }

  const { error, response } = await CVNextGenCVConfigService.saveConfigs({
    accountId,
    group: 'XHR_SAVE_CONFIG_GROUP',
    configsToSave
  })

  if (!error) {
    return { error, configsToShow: appdConfig }
  } else if (response?.resource) {
    return { configsToShow: transformGetConfigs(response.resource as AppDynamicsCVConfig[])[0] }
  }

  return { configsToShow: appdConfig }
}
