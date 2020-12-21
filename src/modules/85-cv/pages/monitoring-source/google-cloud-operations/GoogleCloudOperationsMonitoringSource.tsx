import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import { useStrings } from 'framework/exports'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import { Page } from '@common/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetDataSourceConfigs } from 'services/cv'
import { SelectProduct } from '../SelectProduct/SelectProduct'
import { SelectGCODashboards } from './SelectGCODashboards/SelectGCODashboards'
import { MapGCOMetricsToServices } from './MapGCOMetricsToServices/MapGCOMetricsToServices'
import { buildGCOMonitoringSourceInfo, GCOMonitoringSourceInfo } from './GoogleCloudOperationsMonitoringSourceUtils'
import { ReviewGCOMonitoringSource } from './ReviewGCOMonitoringSource/ReviewGCOMonitoringSource'

const DefaultValue = {
  name: `MyGoogleCloudOperationsSource`
}

export function GoogleCloudOperationsMonitoringSource(): JSX.Element {
  const { getString } = useStrings()
  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<GCOMonitoringSourceInfo>({ totalTabs: 4 })
  const params = useParams<ProjectPathProps & { monitoringSourceId: string }>()

  const { loading, error, refetch: fetchGCOSource } = useGetDataSourceConfigs({
    queryParams: {
      accountId: params.accountId
    },
    lazy: true
  })

  useEffect(() => {
    if (params.monitoringSourceId && !currentData) {
      fetchGCOSource()
    }
  }, [params])

  return (
    <Page.Body loading={loading} error={error?.message}>
      <CVOnboardingTabs
        iconName="service-stackdriver"
        defaultEntityName={currentData?.monitoringSourceName || DefaultValue.name}
        setName={val => setCurrentData({ ...currentData, monitoringSourceName: val } as GCOMonitoringSourceInfo)}
        onNext={onNext}
        {...tabInfo}
        tabProps={[
          {
            id: 1,
            title: getString('selectProduct'),
            component: (
              <SelectProduct<GCOMonitoringSourceInfo>
                stepData={currentData || buildGCOMonitoringSourceInfo(params)}
                type="GoogleCloudOperations"
                onCompleteStep={data => {
                  setCurrentData(data)
                  onNext({ data })
                }}
                productSelectValidationText={getString('cv.monitoringSources.gco.productValidationText')}
              />
            )
          },
          {
            id: 2,
            title: getString('cv.monitoringSources.gco.tabName.selectDashboards'),
            component: (
              <SelectGCODashboards
                data={currentData || buildGCOMonitoringSourceInfo(params)}
                onPrevious={tabInfo.onPrevious}
                onNext={data => {
                  setCurrentData(data)
                  onNext({ data })
                }}
              />
            )
          },
          {
            id: 3,
            title: getString('cv.monitoringSources.mapMetricsToServices'),
            component: (
              <MapGCOMetricsToServices
                data={currentData || buildGCOMonitoringSourceInfo(params)}
                onPrevious={tabInfo.onPrevious}
                onNext={data => {
                  setCurrentData(data)
                  onNext({ data })
                }}
              />
            )
          },
          {
            id: 4,
            title: getString('review'),
            component: (
              <ReviewGCOMonitoringSource
                data={currentData || buildGCOMonitoringSourceInfo(params)}
                onPrevious={tabInfo.onPrevious}
                onSubmit={data => {
                  setCurrentData(data)
                  onNext({ data })
                }}
              />
            )
          }
        ]}
      />
    </Page.Body>
  )
}
