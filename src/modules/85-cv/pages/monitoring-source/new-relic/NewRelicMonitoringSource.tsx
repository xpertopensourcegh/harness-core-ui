import React from 'react'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { SetupSourceTabs } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SelectNewRelicConnector } from './SelectNewRelicConnector/SelectNewRelicConnector'
import { buildDefaultNewRelicMonitoringSource, NewRelicSetupSource } from './NewRelicMonitoringSourceUtils'
import { MapNewRelicAppsToServicesAndEnvs } from './MapNewRelicAppsToServicesAndEnvs/MapNewRelicAppsToServicesAndEnvs'

const NewRelicTabIndex = {
  SELECT_CONNECTOR: 0,
  MAP_APPLICATIONS: 1
}

function determineMaxTab(data: NewRelicSetupSource): number {
  if (data?.productName && data?.connectorRef) {
    return NewRelicTabIndex.MAP_APPLICATIONS
  }

  return NewRelicTabIndex.SELECT_CONNECTOR
}

export function NewRelicMonitoringSource(): JSX.Element {
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  return (
    <SetupSourceTabs
      data={buildDefaultNewRelicMonitoringSource({ projectIdentifier, orgIdentifier, accountId })}
      determineMaxTab={determineMaxTab}
      tabTitles={[
        getString('cv.onboarding.monitoringSources.defineMonitoringSource'),
        `${getString('mapApplications')} ${getString('and')} ${getString('environments')}`
      ]}
    >
      <SelectNewRelicConnector />
      <MapNewRelicAppsToServicesAndEnvs />
    </SetupSourceTabs>
  )
}
