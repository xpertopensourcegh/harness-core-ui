import React from 'react'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import type { DSConfig } from 'services/cv'
import { SetupSourceTabs } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { determineMaxTab, transformPrometheusDSConfigIntoPrometheusSetupSource } from './utils'
import type { PrometheusSetupSource } from './constants'
import { SelectPrometheusConnector } from './components/SelectPrometheusConnector/SelectPrometheusConnector'
import { MapPrometheusQueriesToServicesAndEnvs } from './components/MapPrometheusQueriesToServicesAndEnvs/MapPrometheusQueriesToServicesAndEnvs'
import { ReviewPrometheusMapping } from './components/ReviewPrometheusMappings/ReviewPrometheusMappings'

export function PrometheusMonitoringSource({ dsConfig }: { dsConfig?: DSConfig | null }): JSX.Element {
  const { getString } = useStrings()
  const params = useParams<ProjectPathProps>()
  return (
    <SetupSourceTabs<PrometheusSetupSource>
      data={transformPrometheusDSConfigIntoPrometheusSetupSource(params, dsConfig)}
      determineMaxTab={determineMaxTab}
      tabTitles={[
        getString('cv.onboarding.monitoringSources.defineMonitoringSource'),
        getString('cv.monitoringSources.prometheus.mapPrometheusMetricsToServicesAndEnvs'),
        getString('review')
      ]}
    >
      <SelectPrometheusConnector />
      <MapPrometheusQueriesToServicesAndEnvs />
      <ReviewPrometheusMapping />
    </SetupSourceTabs>
  )
}
