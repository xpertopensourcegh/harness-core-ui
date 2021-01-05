import React from 'react'
import { Color, Layout, Text } from '@wings-software/uicore'
import { Page } from '@common/exports'
import i18n from './CFHomePage.i18n'

const CFHomePage: React.FC = () => {
  return (
    <Page.Body>
      <Layout.Vertical padding="large">
        <Text color={Color.BLACK} font={{ size: 'large', weight: 'bold' }}>
          {i18n.dashboard}
        </Text>
      </Layout.Vertical>
    </Page.Body>
  )
}

export default CFHomePage
