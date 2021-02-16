import React from 'react'
import { Container, Button, Heading, Text, Icon, Layout } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { Page } from '@common/exports'
import { useAppStore } from 'framework/exports'
import i18n from './CDDashboardPage.i18n'

export const CDDashboardPage: React.FC = () => {
  const { projectIdentifier, accountId } = useParams()
  const { selectedProject: project } = useAppStore()
  const history = useHistory()

  return (
    <Page.Body>
      <Container width={600} style={{ margin: '0 auto', paddingTop: 200 }}>
        <Layout.Vertical spacing="large" flex>
          <Heading>{i18n.welcome}</Heading>
          <Text>{i18n.description}</Text>
          <Icon name="cd-main" size={200} />
          <Button
            width={200}
            text={i18n.creatPipeline}
            intent="primary"
            onClick={() =>
              history.push(
                routes.toPipelineStudio({
                  orgIdentifier: project?.orgIdentifier as string,
                  projectIdentifier: projectIdentifier as string,
                  pipelineIdentifier: '-1',
                  accountId,
                  module: 'cd'
                })
              )
            }
          />
        </Layout.Vertical>
      </Container>
    </Page.Body>
  )
}

export default CDDashboardPage
