import React, { useState, useEffect } from 'react'
import type { SelectOption } from '@wings-software/uikit'
import { Container } from '@wings-software/uikit'
import type { CVConfig, Service } from '@wings-software/swagger-ts/definitions'
import { useLocation, useParams } from 'react-router'
import * as AppDynamicsOnboardingUtils from '../AppDynamics/AppDynamicsOnboardingUtils'
import * as SplunkOnboardingUtils from '../Splunk/SplunkOnboardingUtils'
import { CVNextGenCVConfigService, SettingsService } from 'modules/cv/services'
import xhr from '@wings-software/xhr-async'
import OnBoardingConfigSetupHeader from 'modules/cv/components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import { RouteVerificationTypeToVerificationType } from 'modules/cv/constants'
import AppDynamicsMainSetupView from '../AppDynamics/AppDynamicsMainSetupView'
import css from './BaseOnBoardingSetupPage.module.scss'
import SplunkOnboarding from '../Splunk/SplunkOnboarding'
import { accountId, connectorId, appId } from 'modules/cv/constants'

const XHR_SERVICES_GROUP = 'XHR_SERVICES_GROUP'

function getDefaultCVConfig(
  verificationProvider: CVConfig['type'],
  dataSourceId: string,
  selectedEntities: SelectOption[],
  accId: string
): CVConfig[] {
  switch (verificationProvider) {
    case 'APP_DYNAMICS':
      return selectedEntities.map(selectedEntity => {
        return AppDynamicsOnboardingUtils.createDefaultConfigObjectBasedOnSelectedApps(
          selectedEntity,
          dataSourceId,
          accId
        )
      })
    case 'SPLUNK':
      return SplunkOnboardingUtils.mapQueries(selectedEntities)
    default:
      return []
  }
}

function transformIncomingCVConfigs(savedConfig: CVConfig[], verificationProvider: CVConfig['type']) {
  switch (verificationProvider) {
    case 'APP_DYNAMICS':
      return AppDynamicsOnboardingUtils.transformGetConfigs(
        (savedConfig as unknown) as AppDynamicsOnboardingUtils.AppDynamicsCVConfig[]
      )
  }
}

async function fetchServices(localAppId: string, accId: string): Promise<SelectOption[] | undefined> {
  const { status, error, response } = await SettingsService.fetchServices(localAppId, XHR_SERVICES_GROUP, accId)
  if (status === xhr.ABORTED || error) {
    return
  }
  if (response?.resource) {
    const resp: any = response.resource
    return resp.response?.map((service: Service) => ({ label: service.name || '', value: service.uuid }))
  }
  return []
}

export default function OnBoardingSetupPage(): JSX.Element {
  const [serviceOptions, setServices] = useState<SelectOption[]>([{ value: '', label: 'Loading...' }])
  const [configsToRender, setConfigs] = useState<CVConfig[]>([])
  const params = useParams<{ dataSourceType: string }>()
  const { state: locationContext } = useLocation<{
    dataSourceId: string
    selectedEntities: SelectOption[]
    isEdit: boolean
  }>()
  // const accountId = 'zEaak-FLS425IEO7OLzMUg'
  // const appId = '3ugZPVJ_SBCHb9sl5llxFQ'
  // const appId = 'zEaak-FLS425IEO7OLzMUg'
  const verificationType = RouteVerificationTypeToVerificationType[params.dataSourceType]

  // fetch saved data or set selected data from the previous page
  useEffect(() => {
    const { dataSourceId = connectorId, selectedEntities = [], isEdit = false } = locationContext
    if (!isEdit && locationContext.selectedEntities?.length) {
      setConfigs(getDefaultCVConfig(verificationType, dataSourceId || '', selectedEntities, accountId))
    } else if (locationContext.isEdit) {
      CVNextGenCVConfigService.fetchConfigs({
        accountId,
        dataSourceConnectorId: dataSourceId
      }).then(({ status, error, response }) => {
        if (status === xhr.ABORTED) {
          return
        } else if (error) {
          setServices([])
          return // TODO
        } else if (response?.resource) {
          const configs = response.resource || []
          setConfigs(transformIncomingCVConfigs(configs, verificationType) as CVConfig[])
        }
      })
    }
  }, [locationContext, verificationType])

  // fetch services
  useEffect(() => {
    fetchServices(appId, accountId).then(services => {
      setServices(services?.length ? services : [])
    })
  }, [])

  return (
    <Container className={css.main}>
      <OnBoardingConfigSetupHeader
        iconName={verificationType === 'APP_DYNAMICS' ? 'service-appdynamics' : 'service-splunk'}
        iconSubText={verificationType === 'APP_DYNAMICS' ? 'App Dynamics' : 'Splunk'}
        pageHeading="Map your app and tiers to a Harness service and environment"
      />
      {verificationType === 'APP_DYNAMICS' && (
        <AppDynamicsMainSetupView
          serviceOptions={serviceOptions}
          configs={configsToRender as AppDynamicsOnboardingUtils.CVConfigTableData[]}
          selectedEntities={locationContext.selectedEntities}
        />
      )}
      {verificationType === 'SPLUNK' && (
        <SplunkOnboarding
          serviceOptions={serviceOptions}
          configs={configsToRender}
          selectedEntities={locationContext.selectedEntities}
        />
      )}
    </Container>
  )
}
