import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { Card, Layout } from '@wings-software/uicore'
import { Page } from '@common/exports'
import { GetServiceDetailsQueryParams, useGetServiceDetails } from 'services/cd-ng'
import { DeploymentsTimeRangeContext, useServiceStore, Views } from '@dashboards/components/Services/common'
import { ServiceInstancesWidget } from '@dashboards/components/Services/ServiceInstancesWidget/ServiceInstancesWidget'
import { MostActiveServicesWidget } from '@dashboards/components/Services/MostActiveServicesWidget/MostActiveServicesWidget'
import { startOfDay, TimeRangeSelectorProps } from '@dashboards/components/TimeRangeSelector/TimeRangeSelector'
import { ServiceInstancesWidgetMock } from '@dashboards/mock'
import { DeploymentsWidget } from '@dashboards/components/Services/DeploymentsWidget/DeploymentsWidget'
import { ServicesList, ServicesListProps } from '@dashboards/components/Services/ServicesList/ServicesList'
import type { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import css from '@dashboards/components/Services/ServicesContent/ServicesContent.module.scss'

export const ServicesContent: React.FC = () => {
  const { view } = useServiceStore()
  const { getString } = useStrings()
  const [timeRange, setTimeRange] = useState<TimeRangeSelectorProps>({
    range: [startOfDay(moment().subtract(6, 'month')), startOfDay(moment())],
    label: getString('dashboards.serviceDashboard.6months')
  })

  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps & ModulePathParams>()

  const queryParams: GetServiceDetailsQueryParams = {
    accountIdentifier: accountId,
    orgIdentifier,
    projectIdentifier,
    startTime: timeRange?.range[0]?.getTime() || 0,
    endTime: timeRange?.range[1] ? moment(timeRange.range[1]).add(1, 'days').toDate().getTime() : 0
  }

  const {
    loading,
    data: serviceDetails,
    error,
    refetch
  } = useGetServiceDetails({
    queryParams
  })

  const serviceDetailsProps: ServicesListProps = {
    loading,
    error: !!error,
    data: serviceDetails?.data?.serviceDeploymentDetailsList || [],
    refetch
  }

  return (
    <Page.Body className={css.pageBody}>
      <Layout.Vertical
        margin={{ left: 'xlarge', right: 'xlarge', top: view === Views.INSIGHT ? 'large' : 0, bottom: 'large' }}
        className={css.container}
      >
        {view === Views.INSIGHT && (
          <Layout.Horizontal margin={{ bottom: 'large' }}>
            <ServiceInstancesWidget {...ServiceInstancesWidgetMock} />
            <DeploymentsTimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
              <Card className={css.card}>
                <MostActiveServicesWidget title={getString('dashboards.serviceDashboard.mostActiveServices')} />
                <div className={css.separator} />
                <DeploymentsWidget />
              </Card>
            </DeploymentsTimeRangeContext.Provider>
          </Layout.Horizontal>
        )}
        <ServicesList {...serviceDetailsProps} />
      </Layout.Vertical>
    </Page.Body>
  )
}
