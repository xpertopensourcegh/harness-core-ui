import React from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@wings-software/uikit'
import routes from '@common/RouteDefinitions'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import i18n from './MonitoringSource.i18n'
import AppDMonitoringSource from './app-dynamics/AppDMonitoringSource'
import { OnBoardingPageHeader } from '../onboarding/OnBoardingPageHeader/OnBoardingPageHeader'
import { GoogleCloudOperationsMonitoringSource } from './google-cloud-operations/GoogleCloudOperationsMonitoringSource'
import css from './MonitoringSource.module.scss'

const getContentByType = (type: string): JSX.Element => {
  switch (type) {
    case 'AppDynamics':
      return <AppDMonitoringSource />
    case 'GoogleCloudOperations':
      return <GoogleCloudOperationsMonitoringSource />
    default:
      return <></>
  }
}

const MonitoringSource = (): JSX.Element => {
  const { monitoringSource, projectIdentifier, orgIdentifier, accountId } = useParams<
    AccountPathProps & ProjectPathProps & { monitoringSource: string }
  >()
  return (
    <Container className={css.pageDimensions}>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            label: i18n.breadCrumb,
            url: routes.toCVAdminSetupMonitoringSource({
              projectIdentifier,
              orgIdentifier,
              monitoringSource,
              accountId
            })
          }
        ]}
      />
      <Container className={css.pageBody}>{getContentByType(monitoringSource)}</Container>
    </Container>
  )
}

export default MonitoringSource
