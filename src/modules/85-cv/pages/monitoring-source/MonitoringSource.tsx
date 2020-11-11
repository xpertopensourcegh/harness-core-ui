import React from 'react'

import { Layout, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'

import i18n from './MonitoringSource.i18n'
import AppDMonitoringSource from './app-dynamics/AppDMonitoringSource'

const getContentByType = (type: string) => {
  switch (type) {
    case 'AppDynamics':
      return <AppDMonitoringSource />
    default:
      return <></>
  }
}

const MonitoringSource = () => {
  const { monitoringSource } = useParams()
  const renderTitle = () => {
    return (
      <Layout.Vertical>
        <Text>{i18n.breadCrumb}</Text>
      </Layout.Vertical>
    )
  }
  return (
    <>
      <Page.Header title={renderTitle()}></Page.Header>
      <Page.Body>{getContentByType(monitoringSource)}</Page.Body>
    </>
  )
}

export default MonitoringSource
