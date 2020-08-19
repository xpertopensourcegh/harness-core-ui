import React from 'react'
import { Container, Text, HarnessIcons, Color, Icon, Button } from '@wings-software/uikit'
import { useHistory, useLocation } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import { routeCVOnBoardingSetup, routeCVDataSourcesEntityPage } from 'modules/cv/routes'
import { DataSourceRoutePaths } from 'modules/cv/routePaths'
import { routeParams } from 'framework/exports'
import i18n from './SplunkInputType.i18n'
import css from './SplunkInputType.module.scss'

export default function SplunkInputType(): JSX.Element {
  const HarnessLogo = HarnessIcons['harness-logo-black']
  const SplunkLogo = HarnessIcons['service-splunk-with-name']
  const history = useHistory()
  const { query } = routeParams()
  const { state: locationContext = {} } = useLocation()

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
                pathname: routeCVOnBoardingSetup.url({ dataSourceType: DataSourceRoutePaths.SPLUNK }),
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
                pathname: routeCVDataSourcesEntityPage.url({ dataSourceType: DataSourceRoutePaths.SPLUNK }),
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
