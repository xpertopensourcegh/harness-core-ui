import React from 'react'
import { Layout } from '@wings-software/uicore'
import { Page } from '@common/exports'
import { useServiceStore, Views } from '@dashboards/components/Services/common'
import { ServiceInstancesWidget } from '@dashboards/components/Services/ServiceInstancesWidget/ServiceInstancesWidget'
import { MostActiveServicesWidget } from '@dashboards/components/Services/MostActiveServicesWidget/MostActiveServicesWidget'
import { ServiceInstancesWidgetMock, MostActiveServicesWidgetMock, DeploymentsWidgetMock } from '@dashboards/mock'
import { DeploymentsWidget } from '../DeploymentsWidget/DeploymentsWidget'

export const ServicesContent: React.FC = () => {
  const { view } = useServiceStore()
  return (
    <Page.Body>
      <Layout.Vertical margin={{ left: 'xxxlarge', right: 'xxxlarge', top: 'large', bottom: 'large' }}>
        {view === Views.INSIGHT && (
          <Layout.Horizontal>
            <ServiceInstancesWidget {...ServiceInstancesWidgetMock} />
            <MostActiveServicesWidget {...MostActiveServicesWidgetMock} />
            <DeploymentsWidget {...DeploymentsWidgetMock} />
          </Layout.Horizontal>
        )}
      </Layout.Vertical>
    </Page.Body>
  )
}
