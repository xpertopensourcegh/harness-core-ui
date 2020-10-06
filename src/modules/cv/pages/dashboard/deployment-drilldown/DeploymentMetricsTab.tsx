import React, { useState, useMemo } from 'react'
import { Container, Pagination, Link } from '@wings-software/uikit'
import { TimelineBar } from 'modules/common/components/TimelineView/TimelineBar'
import type { RestResponseTransactionMetricInfoSummaryPageDTO, HostData } from 'services/cv'
import { getColorValue } from 'modules/common/components/HeatMap/ColorUtils'
import {
  MetricAnalysisFilter,
  MetricAnalysisFilterType
} from '../../services/analysis-drilldown-view/MetricAnalysisView/MetricAnalysisFilter/MetricAnalysisFilter'
import TimeseriesRow, { SeriesConfig } from '../../../components/TimeseriesRow/TimeseriesRow'
import i18n from './DeploymentDrilldownView.i18n'
import styles from './DeploymentDrilldownView.module.scss'

export interface DeploymentMetricsTabProps {
  data: RestResponseTransactionMetricInfoSummaryPageDTO | null
  goToPage(val: number): void
  onAnomalousMetricsOnly(val: boolean): void
}

export interface TransactionRowProps {
  transactionName?: string
  metricName?: string
  riskScore?: number
  nodes?: HostData[]
}

export default function DeploymentMetricsTab({ data, goToPage, onAnomalousMetricsOnly }: DeploymentMetricsTabProps) {
  return (
    <>
      <MetricAnalysisFilter
        onChangeFilter={val => onAnomalousMetricsOnly(val === MetricAnalysisFilterType.ANOMALOUS)}
      />
      <Container className={styles.timeseriesList}>
        {data?.resource?.pageResponse?.content?.map(value => (
          <TransactionRow
            key={(value.transactionMetric?.transactionName as string) + value.transactionMetric?.metricName}
            transactionName={value.transactionMetric?.transactionName}
            metricName={value.transactionMetric?.metricName}
            riskScore={value.transactionMetric?.score}
            nodes={value.nodes}
          />
        ))}
      </Container>
      {!!data?.resource?.pageResponse?.totalPages && (
        <Pagination
          pageSize={data.resource.pageResponse?.pageSize as number}
          pageCount={data.resource.pageResponse.totalPages + 1}
          itemCount={data.resource.pageResponse.totalItems as number}
          pageIndex={data.resource.pageResponse.pageIndex}
          gotoPage={goToPage}
        />
      )}
      {data?.resource?.deploymentTimeRange && (
        <TimelineBar
          className={styles.timelineBar}
          startDate={data?.resource?.deploymentTimeRange.startTime as number}
          endDate={data?.resource?.deploymentTimeRange.endTime as number}
        />
      )}
    </>
  )
}

const DEFAULT_ROW_SIZE = 3

function TransactionRow({ transactionName, metricName, riskScore, nodes = [] }: TransactionRowProps) {
  const [showMax, setShowMax] = useState<number>(DEFAULT_ROW_SIZE)
  const seriesData: Array<SeriesConfig> = useMemo(
    () =>
      nodes
        .map((node, index) => {
          if (index + 1 > showMax) {
            return undefined
          }
          return {
            name: node.hostName,
            series: [
              {
                name: 'one',
                type: 'line',
                color: getColorValue(riskScore!),
                data: node.testData
              },
              {
                name: 'two',
                type: 'line',
                color: 'var(--grey-350)',
                data: node.controlData
              }
            ]
          }
        })
        .filter(val => !!val) as Array<SeriesConfig>,
    [nodes, showMax]
  )
  return (
    <>
      <TimeseriesRow transactionName={transactionName} metricName={metricName} seriesData={seriesData} />
      <Container className={styles.showMore}>
        {nodes.length > showMax && (
          <Link minimal font={{ size: 'small' }} onClick={() => setShowMax(Infinity)}>
            {i18n.showMore}
          </Link>
        )}
        {showMax > DEFAULT_ROW_SIZE && (
          <Link minimal font={{ size: 'small' }} onClick={() => setShowMax(DEFAULT_ROW_SIZE)}>
            {i18n.showLess}
          </Link>
        )}
      </Container>
    </>
  )
}
