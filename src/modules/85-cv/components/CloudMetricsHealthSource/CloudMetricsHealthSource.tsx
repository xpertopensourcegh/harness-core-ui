import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Color, Container, Heading } from '@wings-software/uicore'

import { Drawer } from '@blueprintjs/core'
import { useStrings } from 'framework/strings'
import { SetupSourceLayout } from '@cv/components/CVSetupSourcesView/SetupSourceLayout/SetupSourceLayout'
import { transformSampleDataIntoHighchartOptions } from '@cv/pages/health-source/connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.utils'

import DrawerFooter from '@cv/pages/health-source/common/DrawerFooter/DrawerFooter'
import { QueryContent } from '@cv/components/QueryViewer/QueryViewer'
import {
  DrawerOptions,
  FieldNames
} from '@cv/pages/health-source/connectors/GCOMetricsHealthSource/GCOMetricsHealthSource.constants'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import MonacoEditor from '@common/components/MonacoEditor/MonacoEditor'
import MetricsValidationChart from '@cv/components/CloudMetricsHealthSource/components/validationChart/MetricsValidationChart'
import MetricsConfigureRiskProfile from '@cv/components/CloudMetricsHealthSource/components/metricsConfigureRiskProfile/MetricsConfigureRiskProfile'
import MetricDashboardWidgetNav from '@cv/components/MetricDashboardWidgetNav/MetricDashboardWidgetNav'
import type { CloudMetricsHealthSourceProps } from '@cv/components/CloudMetricsHealthSource/CloudMetricsHealthSource.type'
import css from '@cv/components/CloudMetricsHealthSource/CloudMetricHealthSource.module.scss'

export default function CloudMetricsHealthSource<T>(props: CloudMetricsHealthSourceProps<T>): JSX.Element {
  const {
    metricDetailsContent,
    selectedMetricInfo,
    onFetchTimeseriesData,
    timeseriesDataLoading,
    timeseriesDataError,
    dashboards,
    connectorRef,
    onWidgetMetricSelected,
    onNextClicked,
    manualQueries,
    addManualQueryTitle,
    dataSourceType,
    dashboardDetailRequest,
    dashboardDetailMapper
  } = props
  const { getString } = useStrings()
  const { onPrevious } = useContext(SetupSourceTabsContext)
  const [shouldShowChart, setShouldShowChart] = useState<boolean>(false)
  const [isQueryExpanded, setIsQueryExpanded] = useState(false)

  const sampleData = useMemo(() => {
    return transformSampleDataIntoHighchartOptions(selectedMetricInfo?.timeseriesData || [])
  }, [selectedMetricInfo?.timeseriesData])

  useEffect(() => {
    if (!selectedMetricInfo?.timeseriesData) {
      setShouldShowChart(false)
    }
  }, [selectedMetricInfo?.timeseriesData])

  return (
    <Container>
      <SetupSourceLayout
        leftPanelContent={
          <MetricDashboardWidgetNav<T>
            dashboardWidgetMapper={dashboardDetailMapper}
            dashboardDetailsRequest={dashboardDetailRequest}
            addManualQueryTitle={addManualQueryTitle}
            connectorIdentifier={connectorRef}
            manuallyInputQueries={manualQueries}
            dashboards={dashboards}
            showSpinnerOnLoad={!selectedMetricInfo}
            onSelectMetric={(metricName, query, widget, dashboardTitle, dashboardId) => {
              onWidgetMetricSelected({
                metricName,
                query,
                widgetName: widget,
                dashboardTitle,
                dashboardId
              })
            }}
          />
        }
        content={
          <Container className={css.setupContainer}>
            <Heading level={3} color={Color.BLACK} className={css.sectionHeading}>
              {getString('cv.monitoringSources.gco.mapMetricsToServicesPage.querySpecifications')}
            </Heading>
            <Container className={css.metricsMappingContent}>
              <Container className={css.metricsQueryBuilderContainer}>{metricDetailsContent}</Container>
              <Container className={css.validationContainer}>
                <QueryContent
                  textAreaProps={{ readOnly: !selectedMetricInfo?.queryEditable }}
                  handleFetchRecords={async () => {
                    if (!shouldShowChart) {
                      setShouldShowChart(true)
                    }
                    onFetchTimeseriesData()
                  }}
                  onClickExpand={setIsQueryExpanded}
                  isDialogOpen={false}
                  query={selectedMetricInfo.query}
                  loading={!selectedMetricInfo}
                  textAreaName={FieldNames.QUERY}
                />
                <MetricsValidationChart
                  loading={timeseriesDataLoading}
                  error={timeseriesDataError}
                  sampleData={sampleData}
                  queryValue={selectedMetricInfo?.query}
                  isQueryExecuted={shouldShowChart}
                  onRetry={async () => {
                    if (!selectedMetricInfo?.query?.length) {
                      return
                    }
                    onFetchTimeseriesData()
                  }}
                />
                {isQueryExpanded && (
                  <Drawer
                    {...DrawerOptions}
                    onClose={() => {
                      setIsQueryExpanded(false)
                    }}
                  >
                    <MonacoEditor
                      language="javascript"
                      value={selectedMetricInfo?.query}
                      options={
                        {
                          readOnly: false,
                          wordBasedSuggestions: false,
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: 13
                        } as any
                      }
                    />
                  </Drawer>
                )}
              </Container>
            </Container>
            <MetricsConfigureRiskProfile dataSourceType={dataSourceType} />
            <DrawerFooter onPrevious={onPrevious} isSubmit onNext={onNextClicked} />
          </Container>
        }
      />
    </Container>
  )
}
