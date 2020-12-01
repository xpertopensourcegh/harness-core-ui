import React from 'react'
import { Container } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { ActivitySourceSetupRoutePaths } from '@cv/utils/routeUtils'
import KubernetesActivitySource from './kubernetes/KubernetesActivitySource'
import { OnBoardingPageHeader } from '../OnBoardingPageHeader/OnBoardingPageHeader'
import HarnessCDActivitySource from './harness-cd/HarnessCDActivitySource'
import i18n from './ActivitySourceSetup.i18n'
import css from './ActivitySourceSetup.module.scss'

function activitySourceTypeToComponent(activitySource: string): JSX.Element {
  switch (activitySource) {
    case ActivitySourceSetupRoutePaths.KUBERNETES:
      return <KubernetesActivitySource />
    case ActivitySourceSetupRoutePaths.HARNESS_CD:
      return <HarnessCDActivitySource />
    default:
      return <Container />
  }
}

export default function ActivitySourceSetup(): JSX.Element {
  const { activitySource, projectIdentifier, orgIdentifier, accountId } = useParams()
  return (
    <Container className={css.main}>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            url: routes.toCVActivitySourceSetup({
              projectIdentifier: projectIdentifier as string,
              orgIdentifier: orgIdentifier as string,
              activitySource: activitySource as string,
              accountId
            }),
            label: i18n.breadCrumbLabel
          }
        ]}
      />
      {activitySourceTypeToComponent(activitySource as string)}
    </Container>
  )
}
