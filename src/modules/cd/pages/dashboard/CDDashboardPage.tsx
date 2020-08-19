import React, { useCallback } from 'react'
import { Container, Button, Heading, Text, Icon, Layout } from '@wings-software/uikit'
import { Page } from 'modules/common/exports'
import i18n from './CDDashboardPage.i18n'

export const CDDashboardPage: React.FC = () => {
  const newPipeline = useCallback(() => {
    alert('new')
  }, [])
  return (
    <Page.Body>
      <Container width={600} style={{ margin: '0 auto', paddingTop: 200 }}>
        <Layout.Vertical spacing="large" flex>
          <Heading>{i18n.welcome}</Heading>
          <Text>{i18n.description}</Text>
          <Icon name="nav-cd" size={200} />
          <Button width={200} text={i18n.creatPipeline} intent="primary" onClick={newPipeline} />
        </Layout.Vertical>
      </Container>
    </Page.Body>
  )
}

export default CDDashboardPage
