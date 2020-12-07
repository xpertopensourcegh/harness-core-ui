import React from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@wings-software/uikit'
import routes from '@common/RouteDefinitions'
import i18n from './MonitoringSource.i18n'
import AppDMonitoringSource from './app-dynamics/AppDMonitoringSource'
import { OnBoardingPageHeader } from '../onboarding/OnBoardingPageHeader/OnBoardingPageHeader'
import styles from './MonitoringSource.module.scss'

const getContentByType = (type: string): JSX.Element => {
  switch (type) {
    case 'AppDynamics':
      return <AppDMonitoringSource />
    default:
      return <></>
  }
}

const MonitoringSource = (): JSX.Element => {
  const { monitoringSource, projectIdentifier, orgIdentifier, accountId } = useParams()
  return (
    <>
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
      <Container className={styles.pageBody}>{getContentByType(monitoringSource)}</Container>
    </>
  )
}

export default MonitoringSource
