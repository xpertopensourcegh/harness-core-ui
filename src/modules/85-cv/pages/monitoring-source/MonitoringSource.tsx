import React from 'react'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import { routeCVAdminSetupMonitoringSource } from 'navigation/cv/routes'
import i18n from './MonitoringSource.i18n'
import AppDMonitoringSource from './app-dynamics/AppDMonitoringSource'
import { OnBoardingPageHeader } from '../onboarding/OnBoardingPageHeader/OnBoardingPageHeader'

const getContentByType = (type: string): JSX.Element => {
  switch (type) {
    case 'AppDynamics':
      return <AppDMonitoringSource />
    default:
      return <></>
  }
}

const MonitoringSource = (): JSX.Element => {
  const { monitoringSource, projectIdentifier, orgIdentifier } = useParams()
  return (
    <>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            label: i18n.breadCrumb,
            url: routeCVAdminSetupMonitoringSource.url({ projectIdentifier, orgIdentifier, monitoringSource })
          }
        ]}
      />
      <Page.Body>{getContentByType(monitoringSource)}</Page.Body>
    </>
  )
}

export default MonitoringSource
