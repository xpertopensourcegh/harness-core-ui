import React, { useEffect } from 'react'
import { omit } from 'lodash-es'
import { useParams } from 'react-router-dom'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import { Page } from '@common/exports'
import {
  KubernetesActivitySourceDTO,
  RestResponseKubernetesActivitySourceDTO,
  useGetKubernetesSource
} from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import i18n from './KubernetesActivitySource.i18n'
import { SelectActivitySource } from './SelectActivitySource/SelectActivitySource'
import { SelectKubernetesConnector } from './SelectKubernetesConnector/SelectKubernetesConnector'
import { SelectKubernetesNamespaces } from './SelectKubernetesNamespaces/SelectKubernetesNamespaces'
import { MapWorkloadsToServices } from './MapWorkloadsToServices/MapWorkloadsToServices'
import { ReviewKubernetesActivitySource } from './ReviewKubernetesActivitySource/ReviewKubernetesActivitySource'
import type {
  // buildKubernetesActivitySourceInfo,
  KubernetesActivitySourceInfo,
  WorkloadInfo
} from './KubernetesActivitySourceUtils'

const TabComponents = [
  SelectActivitySource,
  SelectKubernetesConnector,
  SelectKubernetesNamespaces,
  MapWorkloadsToServices,
  ReviewKubernetesActivitySource
]

export function transformApiData(activitySource?: KubernetesActivitySourceDTO): KubernetesActivitySourceInfo {
  if (!activitySource || !activitySource?.activitySourceConfigs?.length) return {} as KubernetesActivitySourceInfo
  const data: KubernetesActivitySourceInfo = {
    ...omit(activitySource, ['lastUpdatedAt', 'activitySourceConfigs']),
    selectedNamespaces: [],
    uuid: activitySource.uuid,
    connectorRef: { value: activitySource.connectorIdentifier, label: activitySource.connectorIdentifier },
    selectedWorkloads: new Map<string, Map<string, WorkloadInfo>>(),
    connectorType: 'Kubernetes'
  }
  for (const activitySourceConfig of activitySource.activitySourceConfigs) {
    if (
      !activitySourceConfig ||
      !activitySourceConfig.namespace ||
      !activitySourceConfig.envIdentifier ||
      !activitySourceConfig.workloadName ||
      !activitySourceConfig.serviceIdentifier
    ) {
      continue
    }

    if (!data.selectedNamespaces.find(namespace => namespace === activitySourceConfig.namespace)) {
      data.selectedNamespaces.push(activitySourceConfig.namespace)
    }

    let namespaceWithWorkload = data.selectedWorkloads.get(activitySourceConfig.namespace)
    if (!namespaceWithWorkload) {
      namespaceWithWorkload = new Map<string, WorkloadInfo>()
      data.selectedWorkloads.set(activitySourceConfig.namespace, namespaceWithWorkload)
    }

    namespaceWithWorkload.set(activitySourceConfig.workloadName, {
      serviceIdentifier: {
        label: activitySourceConfig.serviceIdentifier,
        value: activitySourceConfig.serviceIdentifier
      },
      environmentIdentifier: { label: activitySourceConfig.envIdentifier, value: activitySourceConfig.envIdentifier },
      workload: activitySourceConfig.workloadName,
      selected: true
    })
  }

  return data
}

export function KubernetesActivitySource(): JSX.Element {
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<KubernetesActivitySourceInfo>({
    totalTabs: TabComponents.length
  })
  const { getString } = useStrings()
  const params = useParams<ProjectPathProps & { activitySourceId: string }>()
  const { loading, error, refetch: fetchKubernetesSource } = useGetKubernetesSource({
    lazy: true,
    resolve: function (activitySource: RestResponseKubernetesActivitySourceDTO) {
      setCurrentData(transformApiData(activitySource?.resource))
      return activitySource
    },
    queryParams: {
      projectIdentifier: params.projectIdentifier,
      orgIdentifier: params.orgIdentifier,
      accountId: params.accountId,
      identifier: params.activitySourceId || ''
    }
  })

  useEffect(() => {
    if (params.activitySourceId && !currentData) {
      fetchKubernetesSource()
    }
  }, [params])

  const tabTitles = [
    getString(`cv.activitySources.kubernetes.tabNames[${0}]`),
    getString(`cv.activitySources.kubernetes.tabNames[${1}]`),
    getString(`cv.activitySources.kubernetes.tabNames[${2}]`),
    getString(`cv.activitySources.kubernetes.tabNames[${3}]`),
    getString('review')
  ]

  return (
    <Page.Body loading={loading} error={error?.message}>
      <CVOnboardingTabs
        iconName="service-kubernetes"
        defaultEntityName={i18n.defaultActivitySourceName}
        {...tabInfo}
        onNext={onNext}
        setName={val => setCurrentData({ ...currentData, name: val } as KubernetesActivitySourceInfo)}
        tabProps={TabComponents.map((tabComponent, index) => ({
          id: index + 1,
          title: tabTitles[index],
          component: React.createElement(tabComponent, {
            data: currentData as KubernetesActivitySourceInfo,
            onSubmit: (submittedInfo: KubernetesActivitySourceInfo) => {
              if (submittedInfo) setCurrentData({ ...currentData, ...submittedInfo })
              onNext({ data: { ...currentData, ...submittedInfo } })
            },
            onPrevious: tabInfo.onPrevious
          })
        }))}
      />
    </Page.Body>
  )
}
