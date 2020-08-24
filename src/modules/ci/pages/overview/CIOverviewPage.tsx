import React from 'react'
import { Container, Button, Text } from '@wings-software/uikit'
import { Page } from 'modules/common/exports'
import i18n from './CIOverviewPage.i18n'

const CIOverviewPage: React.FC = () => {
  return (
    <>
      <Page.Header
        title={i18n.overview.toUpperCase()}
        toolbar={
          <Container>
            <Button
              minimal
              intent="primary"
              text={i18n.newBuild}
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

export default CIOverviewPage
