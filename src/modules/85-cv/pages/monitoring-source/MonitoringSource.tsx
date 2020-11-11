import React from 'react'
import { noop } from 'lodash-es'

import { Layout, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'

import SelectProduct from './SelectProduct/SelectProduct'

import i18n from './MonitoringSource.i18n'

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
      <Page.Body>
        <SelectProduct type={monitoringSource} onCompleteStep={() => noop} />
      </Page.Body>
    </>
  )
}

export default MonitoringSource
