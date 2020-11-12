import React from 'react'
import { Container } from '@wings-software/uikit'
import { useRouteParams } from 'framework/exports'
import { routeActivitySourceSetup } from 'navigation/cv/routes'
import { ActivitySourceSetupRoutePaths } from 'navigation/cv/routePaths'
import KubernetesActivitySource from './kubernetes/KubernetesActivitySource'
import { OnBoardingPageHeader } from '../OnBoardingPageHeader/OnBoardingPageHeader'
import i18n from './ActivitySourceSetup.i18n'

function activitySourceTypeToComponent(activitySource: string): JSX.Element {
  switch (activitySource) {
    case ActivitySourceSetupRoutePaths.KUBERNETES:
      return <KubernetesActivitySource />
    default:
      return <Container />
  }
}

export default function ActivitySourceSetup(): JSX.Element {
  const {
    params: { activitySource, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  return (
    <Container>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            url: routeActivitySourceSetup.url({
              projectIdentifier: projectIdentifier as string,
              orgIdentifier: orgIdentifier as string,
              activitySource: activitySource as string
            }),
            label: i18n.breadCrumbLabel
          }
        ]}
      />
      {activitySourceTypeToComponent(activitySource as string)}
    </Container>
  )
}
