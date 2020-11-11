import React from 'react'
import { Container } from '@wings-software/uikit'
import { useRouteParams } from 'framework/exports'
import { ActivitySourceSetupRoutePaths } from 'navigation/cv/routePaths'
import KubernetesActivitySource from './kubernetes/KubernetesActivitySource'

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
    params: { activitySource }
  } = useRouteParams()
  return <Container>{activitySourceTypeToComponent(activitySource as string)}</Container>
}
