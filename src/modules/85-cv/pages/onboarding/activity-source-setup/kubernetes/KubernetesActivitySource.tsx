import React from 'react'
import { Container } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { routeCVAdminSetup } from 'navigation/cv/routes'
import { useRouteParams } from 'framework/exports'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import i18n from './KubernetesActivitySource.i18n'
import { SelectKubernetesConnector } from './SelectKubernetesConnector/SelectKubernetesConnector'
import { SubmitAndPreviousButtons } from '../../SubmitAndPreviousButtons/SubmitAndPreviousButtons'

export default function KubernetesActivitySource(): JSX.Element {
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook()
  const history = useHistory()
  const {
    params: { projectIdentifier, orgIdentifier }
  } = useRouteParams()

  return (
    <Container>
      <CVOnboardingTabs
        iconName="service-kubernetes"
        defaultEntityName={i18n.defaultActivitySourceName}
        {...tabInfo}
        onNext={onNext}
        setName={val => setCurrentData({ ...currentData, name: val })}
        tabProps={[
          {
            id: 1,
            title: i18n.tabNames.selectKubernestesConnector,
            component: <SelectKubernetesConnector />
          },
          {
            id: 2,
            title: i18n.tabNames.selectKubernetesNamespaces,
            component: <Container />
          }
        ]}
      />
      <SubmitAndPreviousButtons
        onPreviousClick={() =>
          history.push(
            routeCVAdminSetup.url({
              projectIdentifier: projectIdentifier as string,
              orgIdentifier: orgIdentifier as string
            })
          )
        }
      />
    </Container>
  )
}
