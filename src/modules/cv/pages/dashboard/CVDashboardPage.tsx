import React from 'react'
import { Container, Button, Heading, Text, Icon, Layout } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import { routeParams } from 'framework/exports'
import { routeCVDataSources } from 'modules/cv/routes'
import i18n from './CVDashboardPage.i18n'

export const CDDashboardPage: React.FC = () => {
  const {
    params: { projectIdentifier, orgIdentifier }
  } = routeParams()
  const history = useHistory()

  return (
    <Page.Body>
      <Container width={600} style={{ margin: '0 auto', paddingTop: 200 }}>
        <Layout.Vertical spacing="large" flex>
          <Heading>{i18n.mainTitleText}</Heading>
          <Text>{i18n.subtitleText}</Text>
          <Icon name="nav-cv" size={200} />
          <Button
            width={200}
            text={i18n.createDataSourceText}
            intent="primary"
            onClick={() =>
              history.push({
                pathname: routeCVDataSources.url({
                  orgId: orgIdentifier as string,
                  projectIdentifier: projectIdentifier as string
                }),
                search: '?onBoarding=true'
              })
            }
          />
        </Layout.Vertical>
      </Container>
    </Page.Body>
  )
}

export default CDDashboardPage
