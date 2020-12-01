import React from 'react'
import { Container, Text, HarnessIcons, Color, Icon, Button } from '@wings-software/uikit'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useQueryParams } from '@common/hooks'
import { Page } from '@common/exports'
import { DataSourceRoutePaths } from '@cv/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import i18n from './SplunkInputType.i18n'
import css from './SplunkInputType.module.scss'

export default function SplunkInputType(): JSX.Element {
  const HarnessLogo = HarnessIcons['harness-logo-black']
  const SplunkLogo = HarnessIcons['service-splunk-with-name']
  const history = useHistory()
  const { projectIdentifier: routeProjectId, orgIdentifier: routeOrgId, accountId } = useParams()
  const query = useQueryParams<Record<string, string>>()
  const { state: locationContext = {} } = useLocation()
  const projectId: string = (routeProjectId as string) || ''
  const orgId: string = (routeOrgId as string) || ''

  return (
    <Page.Body>
      <Container className={css.main}>
        <Container className={css.iconContainer}>
          <HarnessLogo height={30} />
          <Icon name="plus" style={{ margin: '0 var(--spacing-xxlarge)', position: 'relative', top: '3px' }} />
          <SplunkLogo height={50} width={100} />
        </Container>
        <Text className={css.description} color={Color.BLACK}>
          {i18n.description}
        </Text>
        <Container className={css.navigationButtonContainer}>
          <Button
            minimal
            intent="primary"
            icon="plus"
            onClick={() =>
              history.push({
                pathname: routes.toCVOnBoardingSetup({
                  dataSourceType: DataSourceRoutePaths.SPLUNK,
                  projectIdentifier: projectId,
                  orgIdentifier: orgId,
                  accountId
                }),
                search: `?dataSourceId=${query.dataSourceId}`,
                state: locationContext
              })
            }
          >
            {i18n.navigationButtons.manualInput}
          </Button>
          <Button
            intent="primary"
            onClick={() =>
              history.push({
                pathname: routes.toCVDataSourcesEntityPage({
                  dataSourceType: DataSourceRoutePaths.SPLUNK,
                  projectIdentifier: projectId,
                  orgIdentifier: orgId,
                  accountId
                }),
                search: `?dataSourceId=${query.dataSourceId}`,
                state: locationContext
              })
            }
          >
            {i18n.navigationButtons.savedSearches}
          </Button>
        </Container>
      </Container>
    </Page.Body>
  )
}
