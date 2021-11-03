import React from 'react'
import { useParams } from 'react-router-dom'
import type { Views } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { useQueryParams } from '@common/hooks'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import { getCVMonitoringServicesSearchParam } from '@cv/utils/CommonUtils'

const DetailsBreadcrumb: React.FC = () => {
  const { getString } = useStrings()
  const { view } = useQueryParams<{ view?: Views.GRID }>()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()

  return (
    <NGBreadcrumbs
      links={[
        {
          url: `${routes.toCVMonitoringServices({
            accountId,
            orgIdentifier,
            projectIdentifier
          })}${getCVMonitoringServicesSearchParam({ view })}`,
          label: getString('cv.monitoredServices.title')
        }
      ]}
    />
  )
}

export default DetailsBreadcrumb
