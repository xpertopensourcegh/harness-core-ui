import React from 'react'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import i18n from './KubernetesActivitySource.i18n'
import { SelectActivitySource } from './SelectActivitySource/SelectActivitySource'
import { SelectKubernetesConnector } from './SelectKubernetesConnector/SelectKubernetesConnector'
import { SelectKubernetesNamespaces } from './SelectKubernetesNamespaces/SelectKubernetesNamespaces'
import { MapWorkloadsToServices } from './MapWorkloadsToServices/MapWorkloadsToServices'
import { ReviewKubernetesActivitySource } from './ReviewKubernetesActivitySource/ReviewKubernetesActivitySource'

export default function KubernetesActivitySource(): JSX.Element {
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<any>()
  const { getString } = useStrings()
  const tabComponents = [
    SelectActivitySource,
    SelectKubernetesConnector,
    SelectKubernetesNamespaces,
    MapWorkloadsToServices,
    ReviewKubernetesActivitySource
  ]
  return (
    <CVOnboardingTabs
      iconName="service-kubernetes"
      defaultEntityName={i18n.defaultActivitySourceName}
      {...tabInfo}
      onNext={onNext}
      setName={val => setCurrentData({ ...currentData, name: val })}
      tabProps={tabComponents.map((tabComponent, index) => ({
        id: index + 1,
        title: getString(`cv.activitySources.kubernetes.tabNames[${index}]`),
        component: React.createElement(tabComponent, {
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
