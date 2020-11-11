import React from 'react'
import { Container } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { routeActivitySourceSetup } from 'navigation/cv/routes'
import { OnBoardingPageHeader } from '../../OnBoardingPageHeader/OnBoardingPageHeader'
import i18n from './KubernetesActivitySource.i18n'

export default function KubernetesActivitySource(): JSX.Element {
  const { orgIdentifier, projectIdentifier, activitySource } = useParams()
  return (
    <Container>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            url: routeActivitySourceSetup.url({ projectIdentifier, orgIdentifier, activitySource }),
            label: i18n.breadCrumbLabel
          }
        ]}
      />
    </Container>
  )
}
