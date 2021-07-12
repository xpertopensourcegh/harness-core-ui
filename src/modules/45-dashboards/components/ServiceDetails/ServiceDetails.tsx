import React from 'react'
import { Layout } from '@wings-software/uicore'
import { Page } from '@common/exports'
import { ServiceDetailsHeader } from '@dashboards/components/ServiceDetails/ServiceDetailsHeader/ServiceDetailsHeader'
import { ActiveServiceInstances } from '@dashboards/components/ServiceDetails/ActiveServiceInstances/ActiveServiceInstances'

const ServiceDetails: React.FC = () => {
  return (
    <Page.Body>
      <Layout.Vertical>
        <ServiceDetailsHeader />
        <ActiveServiceInstances />
      </Layout.Vertical>
    </Page.Body>
  )
}

export default ServiceDetails
