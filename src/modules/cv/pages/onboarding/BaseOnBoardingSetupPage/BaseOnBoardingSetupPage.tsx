import React, { useState, useEffect } from 'react'
import type { SelectOption } from '@wings-software/uikit'
import { Container } from '@wings-software/uikit'
import type { CVConfig, Service } from '@wings-software/swagger-ts/definitions'
import { useLocation, useParams } from 'react-router'
import * as AppDynamicsOnboardingUtils from '../AppDynamics/AppDynamicsOnboardingUtils'
import { CVNextGenCVConfigService, SettingsService } from 'modules/cv/services'
import xhr from '@wings-software/xhr-async'
import OnBoardingConfigSetupHeader from 'modules/cv/components/OnBoardingConfigSetupHeader/OnBoardingConfigSetupHeader'
import { RouteVerificationTypeToVerificationType } from 'modules/cv/constants'
import AppDynamicsMainSetupView from '../AppDynamics/AppDynamicsMainSetupView'

const XHR_SERVICES_GROUP = 'XHR_SERVICES_GROUP'

function getDefaultCVConfig(
  verificationProvider: CVConfig['type'],
  dataSourceId: string,
  selectedEntities: SelectOption[],
  accountId: string
): CVConfig[] {
  switch (verificationProvider) {
    case 'APP_DYNAMICS':
      return selectedEntities.map(selectedEntity => {
        console.log('er')
        return AppDynamicsOnboardingUtils.createDefaultConfigObjectBasedOnSelectedApps(
          selectedEntity,
          dataSourceId,
          accountId
        )
      })
    default:
      return []
  }
}

async function fetchServices(localAppId: string): Promise<SelectOption[] | undefined> {
  const { status, error, response } = await SettingsService.fetchServices(localAppId, XHR_SERVICES_GROUP)
  if (status === xhr.ABORTED || error) {
    return
  }
  if (response?.resource) {
    return response.resource.response?.map((service: Service) => ({ label: service.name || '', value: service.uuid }))
  }
  return []
}

export default function OnBoardingSetupPage() {
  const [serviceOptions, setServices] = useState<SelectOption[]>([{ value: '', label: 'Loading...' }])
  const [configsToRender, setConfigs] = useState<CVConfig[]>([])
  const params = useParams<{ dataSourceType: string }>()
  const { state: onboardingContext } = useLocation<{
    dataSourceId: string
    selectedEntities: SelectOption[]
    isEdit: boolean
  }>()
  const accountId = 'kmpySmUISimoRrJL6NL73w'
  // const appId = '3ugZPVJ_SBCHb9sl5llxFQ'
  const appId = 'ogVkjRvETFOG4-2e_kYPQA'
  const verificationType = RouteVerificationTypeToVerificationType[params.dataSourceType]

  // fetch saved data or set selected data from the previous page
  useEffect(() => {
    const { dataSourceId = '', selectedEntities = [], isEdit = false } = onboardingContext
    if (!isEdit && onboardingContext.selectedEntities?.length) {
      setConfigs(getDefaultCVConfig(verificationType, dataSourceId || '', selectedEntities, accountId))
    } else if (onboardingContext.isEdit) {
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
          setConfigs(response.resource)
        }
      })
    }
  }, [onboardingContext, verificationType])

  // fetch services
  useEffect(() => {
    fetchServices(appId).then(services => {
      setServices(services?.length ? services : [])
    })
  }, [])

  return (
    <Container>
      <OnBoardingConfigSetupHeader
        iconName="service-appdynamics"
        iconSubText="App Dynamics"
        pageHeading="Map your app and tiers to a Harness service and environment"
      />
      {verificationType === 'APP_DYNAMICS' && (
        <AppDynamicsMainSetupView
          serviceOptions={serviceOptions}
          configs={(configsToRender as unknown) as AppDynamicsOnboardingUtils.CVConfigTableData[]}
        />
      )}
    </Container>
  )
}
