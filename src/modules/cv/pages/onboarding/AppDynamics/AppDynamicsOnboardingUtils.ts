import type { NewRelicApplication } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { VerificationTypes } from '../../../constants'
import type { XhrResponse } from '@wings-software/xhr-async'

export function createDefaultConfigObject(
  connectorId: string,
  applicationId: string,
  accountId: string,
  appName: string
) {
  return {
    applicationId,
    connectorId,
    type: VerificationTypes.APP_DYNAMICS,
    accountId,
    metricPacks: [],
    tableData: [],
    metricPackList: [],
    appName
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

export function transformGetConfigs(appDConfigs): any[] {
  if (!appDConfigs?.length) {
    return []
  }

  const appsToAppDConfigs = new Map<string, any>()
  for (const config of appDConfigs) {
    if (!config) {
      continue
    }

    config.applicationId = Number(config.applicationId)
    config.tierId = Number(config.tierId)
    const { applicationId, tierId, serviceId, metricPacks, uuid } = config
    const transformedConfig = appsToAppDConfigs.get(applicationId) || config
    if (!transformedConfig.tableData) {
      transformedConfig.tableData = []
      transformedConfig.metricPackList = metricPacks?.map(mp => mp.name) || []
      appsToAppDConfigs.set(applicationId, transformedConfig)
    }
    transformedConfig.tableData.push({
      tier: { id: tierId, name: '' },
      serviceId,
      selected: true,
      isExisting: true,
      configUUID: uuid
    })
  }

  return Array.from(appsToAppDConfigs.values())
}

export function transformToSaveConfig(appDConfig): [string[], any[], any[]] {
  const clonedConfig = { ...appDConfig }
  const configIdsToDelete: string[] = []
  const configsToSave: any[] = []
  const configsToUpdate: any[] = []

  const { tableData = [] } = clonedConfig || {}

  // convert table data to list of configs to save
  delete clonedConfig.tableData
  delete clonedConfig.metricPackList
  for (const tableRow of tableData) {
    if (tableRow.selected) {
      if (tableRow.isExisting) {
        configsToUpdate.push({
          ...clonedConfig,
          tierId: tableRow.tier?.id,
          serviceId: tableRow.serviceId,
          uuid: tableRow.configUUID
        })
      } else {
        const { connectorId, applicationId, accountId, metricPacks } = clonedConfig
        configsToSave.push({
          tierId: tableRow.tier?.id,
          serviceId: tableRow.serviceId,
          // metricPacks,
          type: VerificationTypes.APP_DYNAMICS,
          accountId,
          applicationId,
          connectorId
        })
      }
    } else if (tableRow.isExisting) {
      configIdsToDelete.push(tableRow.configUUID)
    }
  }

  return [configIdsToDelete, configsToUpdate, configsToSave]
}

export async function saveAppDConfig(appdConfig, accountId: string) {
  const [deletedConfigs, updatedConfigs, savedConfigs] = transformToSaveConfig(appdConfig)
  const apisToCall: Array<Promise<XhrResponse<any>>> = []
  if (savedConfigs?.length) {
    apisToCall.push(
      VerificationService.saveConfigs({
        accountId,
        group: 'XHR_SAVE_CONFIG_GROUP',
        configsToSave: savedConfigs
      })
    )
  }
  if (updatedConfigs?.length) {
    apisToCall.push(
      VerificationService.updateConfigs({
        accountId,
        group: 'XHR_UPDATE_CONFIG_GROUP',
        configsToUpdate: updatedConfigs
      })
    )
  }
  if (deletedConfigs?.length) {
    apisToCall.push(
      VerificationService.deleteConfigs({
        accountId,
        group: 'XHR_DELETE_CONFIG_GROUP',
        configsToDelete: deletedConfigs
      })
    )
  }

  // update formik with proper ids (post comes back with new ids) also remove deleted configs
  const promiseResults: Array<XhrResponse<any>> = await Promise.all(apisToCall)
  let configsToShow = [...updatedConfigs]
  if (promiseResults[0]?.response && !promiseResults[0]?.error) {
    configsToShow = [...configsToShow, ...promiseResults[0]?.response]
  } else {
    configsToShow = [...configsToShow, ...savedConfigs]
  }

  if (promiseResults[2]?.status > 299) {
    configsToShow = [...configsToShow, ...deletedConfigs]
  }

  const error = promiseResults.find(val => val.error?.length)?.error || undefined
  return { error, configsToShow: transformGetConfigs(configsToShow)[0] }
}
