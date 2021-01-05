import React from 'react'
import { Container, Button, Text } from '@wings-software/uicore'
import { Page } from '@common/exports'
import i18n from './CFDashboardPage.i18n'

const CFDashboardPage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.dashboard.toUpperCase()}
        size="medium"
        toolbar={
          <Container>
            <Button
              minimal
              intent="primary"
              text={i18n.newFeatureFlag}
              icon="add"
              onClick={() => {
                alert('TBD')
              }}
            />
          </Container>
        }
      />
      <Page.Body>
        <Text>To be implemented</Text>
      </Page.Body>
    </>
  )
}

export default CFDashboardPage
