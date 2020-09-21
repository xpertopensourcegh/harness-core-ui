import React, { useState, useMemo, useEffect } from 'react'
import { Container, Tabs, Tab, Link, Pagination } from '@wings-software/uikit'
import TimelineBar from 'modules/common/components/TimelineView/TimelineBar'
import { useGetDeploymentTimeSeries, HostData } from 'services/cv'
import { Page } from 'modules/common/exports'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { routeParams } from 'framework/exports'
import { useToaster } from 'modules/common/exports'
import DeploymentGroupList from './DeploymentGroupList'
import TimeseriesRow, { SeriesConfig } from '../../../components/TimeseriesRow/TimeseriesRow'
import {
  MetricAnalysisFilter,
  MetricAnalysisFilterType
} from '../../services/analysis-drilldown-view/MetricAnalysisView/MetricAnalysisFilter/MetricAnalysisFilter'
import styles from './DeploymentDrilldownView.module.scss'

export interface TransactionRowProps {
  transactionName?: string
  metricName?: string
  nodes?: HostData[]
}

export default function DeploymentDrilldownView() {
  const {
    params: { accountId },
    query: { jobInstanceId }
  } = routeParams()
  const { showError } = useToaster()
  const [anomalousMetricsOnly, setAnomalousMetricsOnly] = useState<boolean>(true)
  const { data, loading, error, refetch: fetchTimeseries } = useGetDeploymentTimeSeries({
    verificationJobInstanceId: jobInstanceId as string,
    queryParams: {
      accountId: accountId,
      anomalousMetricsOnly
    }
  })

  useEffect(() => {
    if (error) {
      showError(error.message)
    }
  }, [error])

  const goToPage = (page: number) => {
    fetchTimeseries({
      queryParams: {
        accountId: accountId,
        anomalousMetricsOnly,
        pageNumber: page
      }
    })
  }

  return (
    <Page.Body className={styles.main}>
      <Container className={styles.header}></Container>
      <Container className={styles.body}>
        <Container className={styles.sideNav}>
          <DeploymentGroupList
            name="Pre Production Tests"
            items={[
              { name: 'Test 1', environment: 'Freemium', startedOn: 1600097927747, status: 'success' },
              { name: 'Test 2', environment: 'Freemium', startedOn: 1600097927747, status: 'warn' }
            ]}
          />
          <DeploymentGroupList
            name="Post Deployment"
            defaultOpen
            items={[
              { name: 'Blue Green Phase 1', environment: 'Freemium', startedOn: 1600097927747, status: 'success' },
              { name: 'Blue Green Phase 2', environment: 'Freemium', startedOn: 1600097927747, status: 'success' },
              { name: 'Blue Green Phase 3', environment: 'Freemium', startedOn: 1600097927747, status: 'warn' }
            ]}
          />
          <DeploymentGroupList
            name="Production Deployment"
            items={[{ name: 'Prod 1', environment: 'Freemium', startedOn: 1600097927747, status: 'success' }]}
          />
        </Container>
        <Container className={styles.content}>
          <Container className={styles.filters}>
            <Tabs id="tabs1">
              <Tab title="Metrics" id="tab1" />
              <Tab title="Logs" id="tab2" />
            </Tabs>
            <MetricAnalysisFilter
              onChangeFilter={val => setAnomalousMetricsOnly(val === MetricAnalysisFilterType.ANOMALOUS)}
            />
          </Container>
          <Container className={styles.timeseriesList}>
            {data?.resource?.pageResponse?.content?.map(value => (
              <TransactionRow
                key={(value.transactionMetric?.transactionName as string) + value.transactionMetric?.metricName}
                transactionName={value.transactionMetric?.transactionName}
                metricName={value.transactionMetric?.metricName}
                nodes={value.nodes}
              />
            ))}
          </Container>
          {!!data?.resource?.pageResponse?.pageCount && (
            <Pagination
              pageSize={data.resource.pageResponse?.pageSize as number}
              pageCount={data.resource.pageResponse.pageCount + 1}
              itemCount={data.resource.pageResponse.itemCount as number}
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
        </Container>
      </Container>
      {loading && <PageSpinner />}
    </Page.Body>
  )
}

function TransactionRow({ transactionName, metricName, nodes = [] }: TransactionRowProps) {
  const [showMax, setShowMax] = useState<number>(3)
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
                color: 'var(--red-500)',
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
            show more
          </Link>
        )}
      </Container>
    </>
  )
}
