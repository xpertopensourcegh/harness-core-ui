import React from 'react'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import i18n from './KubernetesActivitySource.i18n'
import { SelectActivitySource } from './SelectActivitySource/SelectActivitySource'
import { SelectKubernetesConnector } from './SelectKubernetesConnector/SelectKubernetesConnector'
import { SelectKubernetesNamespaces } from './SelectKubernetesNamespaces/SelectKubernetesNamespaces'
import { MapWorkloadsToServices } from './MapWorkloadsToServices/MapWorkloadsToServices'

export default function KubernetesActivitySource(): JSX.Element {
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<any>()
  const tabComponents = [
    SelectActivitySource,
    SelectKubernetesConnector,
    SelectKubernetesNamespaces,
    MapWorkloadsToServices
  ]
  return (
    <CVOnboardingTabs
      iconName="service-kubernetes"
      defaultEntityName={i18n.defaultActivitySourceName}
      {...tabInfo}
      onNext={onNext}
      setName={val => setCurrentData({ ...currentData, name: val })}
      tabProps={Object.values(i18n.tabNames).map((tabName, index) => ({
        id: index + 1,
        title: tabName,
        component: React.createElement(tabComponents[index], {
          data: currentData,
          onSubmit: data => {
            setCurrentData({ ...currentData, ...data })
            onNext()
          },
          onPrevious: tabInfo.onPrevious
        })
      }))}
    />
  )
}
