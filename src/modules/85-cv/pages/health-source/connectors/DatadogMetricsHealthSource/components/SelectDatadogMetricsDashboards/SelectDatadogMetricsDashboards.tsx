import React, { useCallback, useContext, useMemo } from 'react'
import { DatadogDashboardDTO, useGetDatadogDashboards } from 'services/cv'

import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import MetricsDashboardList from '@cv/components/MetricsDashboardList/MetricsDashboardList'
import type { TableDashboardItem } from '@cv/components/MetricsDashboardList/MetricsDashboardList.type'
import { mapDatadogMetricHealthSourceToDatadogMetricSetupSource } from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.utils'

export function SelectDatadogMetricsDashboards(): JSX.Element {
  const { sourceData } = useContext(SetupSourceTabsContext)
  const dashboardItemMapper: (dashboard: DatadogDashboardDTO) => TableDashboardItem = useCallback(dashboard => {
    return {
      name: dashboard.name,
      id: dashboard.id
    }
  }, [])

  const selectedDashboards = useMemo(() => {
    return (
      sourceData.selectedDashboards ||
      mapDatadogMetricHealthSourceToDatadogMetricSetupSource(sourceData).selectedDashboards
    )
  }, [sourceData])
  return (
    <MetricsDashboardList<DatadogDashboardDTO>
      manualQueryInputTitle={'cv.monitoringSources.datadog.manualInputQueryModal.modalTitle'}
      dashboardsRequest={useGetDatadogDashboards({ lazy: true })}
      defaultItemIcon={'service-datadog'}
      tableTitle={'cv.monitoringSources.datadog.selectDashboardsPage.dashboardColumnName'}
      selectedDashboardList={selectedDashboards || []}
      tableItemMapper={dashboardItemMapper}
    />
  )
}
