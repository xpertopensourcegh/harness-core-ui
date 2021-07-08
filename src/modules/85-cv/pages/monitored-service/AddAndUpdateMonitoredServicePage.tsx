import React from 'react'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/strings'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import AddAndUpdateMonitoredService from './component/AddAndUpdateMonitoredService'
import { MonitoringServicesHeader, HorizontalLayout } from '../commonStyledComponents'

function AddAndUpdateMonitoredServicePage(): JSX.Element {
  const { getString } = useStrings()
  const { selectedProject } = useAppStore()
  const project = selectedProject
  const params = useParams<ProjectPathProps & { identifier: string }>()
  const isEdit = !!params.identifier
  return (
    <>
      <MonitoringServicesHeader height={'80px'}>
        <HorizontalLayout alignItem={'flex-end'}>
          <div>
            <Breadcrumbs
              links={[
                {
                  url: routes.toCVProjectOverview({
                    orgIdentifier: params.orgIdentifier,
                    projectIdentifier: params.projectIdentifier,
                    accountId: params.accountId
                  }),
                  label: project?.name as string
                },
                {
                  url: routes.toCVMonitoringServices({
                    orgIdentifier: params.orgIdentifier,
                    projectIdentifier: params.projectIdentifier,
                    accountId: params.accountId
                  }),
                  label: getString('cv.monitoredServices.title')
                },
                {
                  url: '#',
                  label: ''
                }
              ]}
            />
            <p>
              {!isEdit
                ? getString('cv.monitoredServices.addNewMonitoredServices')
                : getString('cv.monitoredServices.editMonitoredServices')}
            </p>
          </div>
        </HorizontalLayout>
      </MonitoringServicesHeader>
      <AddAndUpdateMonitoredService />
    </>
  )
}

export default AddAndUpdateMonitoredServicePage
