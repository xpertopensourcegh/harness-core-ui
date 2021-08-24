import React from 'react'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import { useStrings } from 'framework/strings'
import { Page } from '@common/exports'
import type { ModulePathParams, ProjectPathProps, ServicePathProps } from '@common/interfaces/RouteInterfaces'

export const ServiceDetailsHeader: React.FC = () => {
  const { accountId, orgIdentifier, projectIdentifier, serviceId, module } = useParams<
    ProjectPathProps & ModulePathParams & ServicePathProps
  >()
  const { getString } = useStrings()
  return (
    <Page.Header
      title={serviceId}
      breadcrumbs={
        <NGBreadcrumbs
          links={[
            {
              url: routes.toServices({ orgIdentifier, projectIdentifier, accountId, module }),
              label: getString('services')
            }
          ]}
        />
      }
    />
  )
}
