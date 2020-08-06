import React, { useState, useEffect } from 'react'
import type { SelectOption } from '@wings-software/uikit'
import { Container } from '@wings-software/uikit'
import type { DSConfig, Service } from '@wings-software/swagger-ts/definitions'
import xhr from '@wings-software/xhr-async'
import { cloneDeep } from 'lodash-es'
import { CVNextGenCVConfigService, SettingsService } from 'modules/cv/services'
import { RouteVerificationTypeToVerificationType } from 'modules/cv/constants'
import { appId } from 'modules/cv/constants'
import { Page } from 'modules/common/exports'
import { routeParams } from 'framework/exports'
import useOnBoardingPageDataHook from 'modules/cv/hooks/OnBoardingPageDataHook/OnBoardingPageDataHook'
import SplunkOnboarding from '../Splunk/SplunkOnboarding'
import AppDynamicsMainSetupView from '../AppDynamics/AppDynamicsMainSetupView'
import * as SplunkOnboardingUtils from '../Splunk/SplunkOnboardingUtils'
import * as AppDynamicsOnboardingUtils from '../AppDynamics/AppDynamicsOnboardingUtils'
import i18n from './BaseOnBoardingSetupPage.i18n'
import css from './BaseOnBoardingSetupPage.module.scss'

const XHR_SERVICES_GROUP = 'XHR_SERVICES_GROUP'
type PageContextData = {
  isEdit?: boolean
  dataSourceId: string
  products: string[]
  selectedEntities?: SelectOption[]
  savedConfigs?: DSConfig[]
}

function getDefaultCVConfig(
  verificationProvider: DSConfig['type'],
  dataSourceId: string,
  selectedEntities: SelectOption[],
  accId: string,
  productName: string
): DSConfig[] {
  switch (verificationProvider) {
    case 'APP_DYNAMICS':
      return selectedEntities.map(selectedEntity => {
        return AppDynamicsOnboardingUtils.createDefaultConfigObjectBasedOnSelectedApps(
          selectedEntity,
          dataSourceId,
          accId,
          productName
        )
      })
    case 'SPLUNK':
      return SplunkOnboardingUtils.createDefaultConfigObjectBasedOnSelectedQueries(
        selectedEntities,
        dataSourceId,
        accId,
        productName
      )
    default:
      return []
  }
}

function transformIncomingDSConfigs(savedConfig: DSConfig[], verificationProvider: DSConfig['type']): DSConfig[] {
  switch (verificationProvider) {
    case 'APP_DYNAMICS':
      return AppDynamicsOnboardingUtils.transformGetConfigs(
        (savedConfig as unknown) as AppDynamicsOnboardingUtils.AppDynamicsDSConfig[]
      )
    case 'SPLUNK':
      return SplunkOnboardingUtils.transformSavedQueries(savedConfig)
    default:
      return []
  }
}

async function fetchServices(localAppId: string, accId: string): Promise<SelectOption[] | undefined> {
  const { status, error, response } = await SettingsService.fetchServices(localAppId, XHR_SERVICES_GROUP, accId)
  if (status === xhr.ABORTED || error) {
    return
  }
  if (response?.resource) {
    const resp: any = response.resource
    return resp.response?.map((service: Service) => ({ label: service.name || '', value: service.name }))
  }
  return []
}

export default function OnBoardingSetupPage(): JSX.Element {
  const {
    params: { accountId, dataSourceType },
    query: { dataSourceId: routeDataSourceId = '' }
  } = routeParams()
  const { pageData, dbInstance, isInitializingDB } = useOnBoardingPageDataHook<PageContextData>(
    routeDataSourceId as string
  )
  const [serviceOptions, setServices] = useState<SelectOption[]>([{ value: '', label: i18n.loading }])
  const [configsToRender, setConfigs] = useState<DSConfig[]>([])
  const [serverError, setServerError] = useState<string | undefined>(undefined)
  const [isLoadingConfigs, setLoadingConfigs] = useState<boolean>(true)
  const verificationType = RouteVerificationTypeToVerificationType[(dataSourceType as DSConfig['type']) || '']

  // fetch saved data or set selected data from the previous page
  useEffect(() => {
    if (!pageData || isInitializingDB) {
      return
    }
    const {
      dataSourceId = routeDataSourceId as string,
      selectedEntities = [],
      isEdit = false,
      products = [],
      savedConfigs
    } = pageData
    if (savedConfigs) {
      setConfigs(cloneDeep(savedConfigs))
      setLoadingConfigs(false)
    } else if (!isEdit) {
      setLoadingConfigs(false)
      setConfigs(getDefaultCVConfig(verificationType, dataSourceId, selectedEntities, accountId, products[0]))
    } else if (isEdit) {
      CVNextGenCVConfigService.fetchConfigs({
        accountId,
        dataSourceConnectorId: dataSourceId,
        productName: products[0]
      }).then(({ status, error, response }) => {
        if (status === xhr.ABORTED) {
          return
        } else if (error?.message) {
          setLoadingConfigs(false)
          setServerError(error.message)
          return // TODO
        } else if (response?.resource) {
          setLoadingConfigs(false)
          const configs = response.resource || []
          setConfigs(transformIncomingDSConfigs(configs, verificationType))
        }
      })
    }
  }, [pageData, verificationType, accountId, routeDataSourceId, isInitializingDB])

  // fetch services
  useEffect(() => {
    fetchServices(appId, accountId).then(services => {
      setServices(services?.length ? services : [])
    })
  }, [accountId])

  return (
    <Page.Body loading={isLoadingConfigs} error={serverError}>
      <Container className={css.main}>
        {!isLoadingConfigs && pageData && verificationType === 'APP_DYNAMICS' && (
          <AppDynamicsMainSetupView
            serviceOptions={serviceOptions}
            configs={configsToRender as AppDynamicsOnboardingUtils.DSConfigTableData[]}
            locationContext={pageData}
            indexedDB={dbInstance}
          />
        )}
        {!isLoadingConfigs && pageData && verificationType === 'SPLUNK' && (
          <SplunkOnboarding serviceOptions={serviceOptions} configs={configsToRender} locationContext={pageData} />
        )}
      </Container>
    </Page.Body>
  )
}
