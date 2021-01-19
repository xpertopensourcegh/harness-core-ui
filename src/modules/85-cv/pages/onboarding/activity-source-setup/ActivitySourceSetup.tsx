import React from 'react'
import { Container } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { ActivitySourceSetupRoutePaths } from '@cv/utils/routeUtils'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/exports'
import { KubernetesActivitySource } from './kubernetes/KubernetesActivitySource'
import { OnBoardingPageHeader } from '../OnBoardingPageHeader/OnBoardingPageHeader'
import HarnessCDActivitySource from './harness-cd/HarnessCDActivitySource'
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
  const { activitySource, projectIdentifier, orgIdentifier, accountId } = useParams<
    ProjectPathProps & { activitySource: string }
  >()
  const { getString } = useStrings()
  return (
    <Container className={css.pageDimensions}>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            url: routes.toCVActivitySourceSetup({
              projectIdentifier,
              orgIdentifier,
              activitySource,
              accountId
            }),
            label: getString('changeSource')
          }
        ]}
      />
      {activitySourceTypeToComponent(activitySource)}
    </Container>
  )
}
