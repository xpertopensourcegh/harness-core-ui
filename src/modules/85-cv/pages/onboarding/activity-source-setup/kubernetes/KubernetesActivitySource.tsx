import React from 'react'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import i18n from './KubernetesActivitySource.i18n'
import { SelectActivitySource } from './SelectActivitySource/SelectActivitySource'
import { SelectKubernetesConnector } from './SelectKubernetesConnector/SelectKubernetesConnector'
import { SelectKubernetesNamespaces } from './SelectKubernetesNamespaces/SelectKubernetesNamespaces'

export default function KubernetesActivitySource(): JSX.Element {
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<any>()

  return (
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
            <SelectActivitySource
              data={currentData}
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
            <SelectKubernetesConnector
              data={currentData}
              onSubmit={data => {
                setCurrentData({ ...currentData, ...data })
                onNext()
              }}
              onPrevious={tabInfo.onPrevious}
            />
          )
        },
        {
          id: 3,
          title: i18n.tabNames.selectKubernetesNamespaces,
          component: (
            <SelectKubernetesNamespaces
              data={currentData}
              onSubmit={data => {
                setCurrentData({ ...currentData, ...data })
                onNext()
              }}
              onPrevious={tabInfo.onPrevious}
            />
          )
        }
      ]}
    />
  )
}
