import React, { useState, useEffect } from 'react'
import type { SelectOption } from '@wings-software/uikit'
import { Container } from '@wings-software/uikit'
import type { DSConfig, Service } from '@wings-software/swagger-ts/definitions'
import { useLocation } from 'react-router'
import * as AppDynamicsOnboardingUtils from '../AppDynamics/AppDynamicsOnboardingUtils'
import * as SplunkOnboardingUtils from '../Splunk/SplunkOnboardingUtils'
import { CVNextGenCVConfigService, SettingsService } from 'modules/cv/services'
import xhr from '@wings-software/xhr-async'
import OnBoardingConfigSetupHeader from 'modules/cv/components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import { RouteVerificationTypeToVerificationType } from 'modules/cv/constants'
import AppDynamicsMainSetupView from '../AppDynamics/AppDynamicsMainSetupView'
import css from './BaseOnBoardingSetupPage.module.scss'
import SplunkOnboarding from '../Splunk/SplunkOnboarding'
import { connectorId, appId } from 'modules/cv/constants'
import { Page } from 'modules/common/exports'
import { routeParams } from 'framework/exports'

const XHR_SERVICES_GROUP = 'XHR_SERVICES_GROUP'

const iconAndSubtextMapper: any = {
  APP_DYNAMICS: {
    iconName: 'service-appdynamics',
    iconSubText: 'App Dynamics',
    pageHeading: 'Map your app and tiers to a Harness service and environment'
  },
  SPLUNK: {
    iconName: 'service-splunk',
    iconSubText: 'Splunk',
    pageHeading: 'Map your query to a Harness service and environment'
  }
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
      return SplunkOnboardingUtils.mapQueries(selectedEntities)
    default:
      return []
  }
}

function transformIncomingDSConfigs(savedConfig: DSConfig[], verificationProvider: DSConfig['type']) {
  switch (verificationProvider) {
    case 'APP_DYNAMICS':
      return AppDynamicsOnboardingUtils.transformGetConfigs(
        (savedConfig as unknown) as AppDynamicsOnboardingUtils.AppDynamicsDSConfig[]
      )
    case 'SPLUNK':
      return SplunkOnboardingUtils.transformSavedQueries(savedConfig)
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
  const [serviceOptions, setServices] = useState<SelectOption[]>([{ value: '', label: 'Loading...' }])
  const [configsToRender, setConfigs] = useState<DSConfig[]>([])
  const {
    params: { accountId, dataSourceType }
  } = routeParams()
  const { state: locationContext } = useLocation<{
    dataSourceId: string
    selectedEntities: SelectOption[]
    isEdit: boolean
    products: string[]
  }>()
  const verificationType = RouteVerificationTypeToVerificationType[(dataSourceType as DSConfig['type']) || '']

  // fetch saved data or set selected data from the previous page
  useEffect(() => {
    const { dataSourceId = connectorId, selectedEntities = [], isEdit = false, products = [] } = locationContext
    if (!isEdit && locationContext.selectedEntities?.length) {
      setConfigs(getDefaultCVConfig(verificationType, dataSourceId || '', selectedEntities, accountId, products[0]))
    } else if (locationContext.isEdit) {
      CVNextGenCVConfigService.fetchConfigs({
        accountId,
        dataSourceConnectorId: dataSourceId,
        productName: locationContext.products[0]
      }).then(({ status, error, response }) => {
        if (status === xhr.ABORTED) {
          return
        } else if (error) {
          setConfigs([])
          return // TODO
        } else if (response?.resource) {
          const configs = response.resource || []
          setConfigs(transformIncomingDSConfigs(configs, verificationType) as DSConfig[])
        }
      })
    }
  }, [locationContext, verificationType, accountId])

  // fetch services
  useEffect(() => {
    fetchServices(appId, accountId).then(services => {
      setServices(services?.length ? services : [])
    })
  }, [])

  return (
    <Page.Body>
      <Container className={css.main}>
        <OnBoardingConfigSetupHeader
          iconName={iconAndSubtextMapper[verificationType!].iconName}
          iconSubText={iconAndSubtextMapper[verificationType!].iconSubText}
          pageHeading={iconAndSubtextMapper[verificationType!].pageHeading}
        />
        {verificationType === 'APP_DYNAMICS' && (
          <AppDynamicsMainSetupView
            serviceOptions={serviceOptions}
            configs={configsToRender as AppDynamicsOnboardingUtils.DSConfigTableData[]}
            locationContext={locationContext}
          />
        )}
        {verificationType === 'SPLUNK' && (
          <SplunkOnboarding
            serviceOptions={serviceOptions}
            configs={configsToRender}
            locationContext={locationContext}
          />
        )}
      </Container>
    </Page.Body>
  )
}
