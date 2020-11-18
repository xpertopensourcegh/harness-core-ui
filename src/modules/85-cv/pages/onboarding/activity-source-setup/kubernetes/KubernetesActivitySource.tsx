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
import { SelectActivitySource } from './SelectActivitySource/SelectActivitySource'
import { SelectKubernetesNamespaces } from './SelectKubernetesNamespaces/SelectKubernetesNamespaces'

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
            title: i18n.tabNames.selectActivitySource,
            component: (
              <SelectKubernetesConnector
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
              />
            )
          },
          {
            id: 2,
            title: i18n.tabNames.selectKubernestesConnector,
            component: (
              <SelectActivitySource
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
              />
            )
          },
          {
            id: 3,
            title: i18n.tabNames.selectKubernetesNamespaces,
            component: (
              <SelectKubernetesNamespaces
                onSubmit={data => {
                  setCurrentData({ ...currentData, ...data })
                  onNext()
                }}
              />
            )
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
