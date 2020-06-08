import type { NewRelicApplication, CVConfig, MetricPack } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'
import { CVNextGenCVConfigService } from '../../../services'
import type { TierAndServiceRow } from './TierAndServiceTable/TierAndServiceTable'

export interface AppDynamicsCVConfig extends CVConfig {
  tierId: string
  applicationId: string
  applicationName?: string
  tierName?: string
  metricPacks: MetricPack[]
}

export interface CVConfigTableData extends AppDynamicsCVConfig {
  tableData?: TierAndServiceRow[]
  metricPackList?: string[]
}

export function createDefaultConfigObjectBasedOnSelectedApps(
  app: SelectOption,
  dataSourceId: string,
  accountId: string
): CVConfigTableData {
  return createDefaultConfigObject(dataSourceId, app.value as string, accountId, app.label)
}

export function createDefaultConfigObject(
  connectorId: string,
  applicationId: string,
  accountId: string,
  appName: string
): CVConfigTableData {
  return {
    applicationId,
    connectorId,
    type: 'APP_DYNAMICS',
    accountId,
    metricPacks: [],
    tableData: [],
    metricPackList: [],
    tierId: '',
    name: '',
    envId: '',
    projectId: '',
    serviceId: '',
    applicationName: appName
  }
}

export function transformAppDynamicsApplications(appdApplications: NewRelicApplication[]): SelectOption[] {
  return (
    appdApplications
      ?.filter((app: NewRelicApplication) => app?.name && app?.id)
      .sort((a, b) => (a.name && b.name && a.name > b.name ? 1 : -1))
      .map(({ name, id }) => ({ label: name || '', value: id || '' })) || []
  )
}

export function transformGetConfigs(appDConfigs: AppDynamicsCVConfig[]): CVConfigTableData[] {
  if (!appDConfigs?.length) {
    return []
  }

  const appsToAppDConfigs = new Map<string, CVConfigTableData>()
  for (const config of appDConfigs) {
    if (!config) {
      continue
    }

    // config.applicationId = config.applicationId
    // config.tierId = config.tierId
    const { applicationId, tierId, serviceId, metricPacks, uuid } = config
    const transformedConfig: CVConfigTableData = appsToAppDConfigs.get(applicationId) || config
    if (!transformedConfig.tableData) {
      transformedConfig.tableData = []
      transformedConfig.metricPackList = metricPacks?.map(mp => mp.name || '').filter(mpName => mpName.length) || []
      appsToAppDConfigs.set(applicationId, transformedConfig)
    }
    transformedConfig.tableData.push({
      tier: { id: parseInt(tierId), name: '' },
      serviceId,
      selected: true,
      isExisting: true,
      configUUID: uuid
    })
  }

  return Array.from(appsToAppDConfigs.values())
}

export function transformToSaveConfig(
  appDConfig: CVConfigTableData
): [string[], AppDynamicsCVConfig[], AppDynamicsCVConfig[], AppDynamicsCVConfig[]] {
  const clonedConfig: CVConfigTableData = { ...appDConfig }
  const configIdsToDelete: string[] = []
  const configsToSave: AppDynamicsCVConfig[] = []
  const configsToUpdate: AppDynamicsCVConfig[] = []
  const configsToDelete: AppDynamicsCVConfig[] = []

  const { tableData = [] } = clonedConfig || {}

  // convert table data to list of configs to save
  delete clonedConfig.tableData
  delete clonedConfig.metricPackList
  for (const tableRow of tableData) {
    if (tableRow.selected) {
      if (tableRow.isExisting) {
        configsToUpdate.push({
          ...clonedConfig,
          tierId: tableRow.tier?.id?.toString() || '',
          serviceId: tableRow.serviceId || '',
          uuid: tableRow.configUUID
        })
      } else {
        configsToSave.push({
          ...clonedConfig,
          tierId: tableRow.tier?.id?.toString() || '',
          serviceId: tableRow.serviceId || ''
        })
      }
    } else if (tableRow.isExisting && tableRow.configUUID) {
      configIdsToDelete.push(tableRow.configUUID)
      configsToDelete.push({ ...clonedConfig })
    }
  }

  return [configIdsToDelete, configsToUpdate, configsToSave, configsToDelete]
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
  const [deletedConfigIds, updatedConfigs, savedConfigs, deletedConfigs] = transformToSaveConfig(appdConfig)
  const apisToCall = []
  if (savedConfigs?.length) {
    apisToCall.push(
      CVNextGenCVConfigService.saveConfigs({
        accountId,
        group: 'XHR_SAVE_CONFIG_GROUP',
        configsToSave: savedConfigs
      })
    )
  }
  if (updatedConfigs?.length) {
    apisToCall.push(
      CVNextGenCVConfigService.updateConfigs({
        accountId,
        group: 'XHR_UPDATE_CONFIG_GROUP',
        configsToUpdate: updatedConfigs
      })
    )
  }
  if (deletedConfigIds?.length) {
    apisToCall.push(
      CVNextGenCVConfigService.deleteConfigs({
        accountId,
        group: 'XHR_DELETE_CONFIG_GROUP',
        configsToDelete: deletedConfigIds
      })
    )
  }

  // update formik with proper ids (post comes back with new ids) also remove deleted configs
  const promiseResults = await Promise.all(apisToCall)
  let configsToShow = [...updatedConfigs]
  if (promiseResults[0]?.response?.resource && !promiseResults[0]?.error) {
    configsToShow = [...configsToShow, ...(promiseResults[0]?.response.resource as AppDynamicsCVConfig[])]
  } else {
    configsToShow = [...configsToShow, ...savedConfigs]
  }

  if (promiseResults[2]?.status > 299) {
    configsToShow = [...configsToShow, ...deletedConfigs]
  }

  const error = promiseResults.find(val => val.error?.length)?.error || undefined
  return { error, configsToShow: transformGetConfigs(configsToShow)[0] }
}
