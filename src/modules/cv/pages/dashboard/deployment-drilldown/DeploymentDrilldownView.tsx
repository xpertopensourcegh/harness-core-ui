import React, { useState, useEffect } from 'react'
import { Container, Tabs, Tab } from '@wings-software/uikit'
import {
  useGetDeploymentTimeSeries,
  HostData,
  useGetDeploymentLogAnalyses,
  useGetClusterChartAnalyses
} from 'services/cv'
import { Page } from 'modules/common/exports'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { useRouteParams } from 'framework/exports'
import { useToaster } from 'modules/common/exports'
import DeploymentGroupList from './DeploymentGroupList'
import DeploymentMetricsTab from './DeploymentMetricsTab'
import DeploymentLogsTab from './DeploymentLogsTab'
import styles from './DeploymentDrilldownView.module.scss'

export interface TransactionRowProps {
  transactionName?: string
  metricName?: string
  nodes?: HostData[]
}

const METRICS_TAB = 'METRICS_TAB'
const LOGS_TAB = 'LOGS_TAB'
const DEFAULT_SELECTED_TAB = METRICS_TAB

export default function DeploymentDrilldownView() {
  const {
    params: { accountId },
    query: { jobInstanceId }
  } = useRouteParams()
  const { showError } = useToaster()
  const [anomalousMetricsOnly, setAnomalousMetricsOnly] = useState<boolean>(true)
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_SELECTED_TAB)
  const { data, loading, error, refetch: fetchTimeseries } = useGetDeploymentTimeSeries({
    verificationJobInstanceId: jobInstanceId as string,
    queryParams: {
      accountId: accountId,
      anomalousMetricsOnly
    }
  })
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    refetch: fetchLogAnalyses
  } = useGetDeploymentLogAnalyses({
    verificationJobInstanceId: jobInstanceId as string,
    queryParams: {
      accountId
    },
    lazy: true
  })
  const {
    data: clusterChartData,
    loading: clusterChartLoading,
    error: clusterChartError,
    refetch: fetchClusterChartData
  } = useGetClusterChartAnalyses({
    verificationJobInstanceId: jobInstanceId as string,
    queryParams: {
      accountId
    },
    lazy: true
  })

  useEffect(() => {
    if (error) {
      showError(error.message)
    } else if (logsError) {
      showError(logsError.message)
    } else if (clusterChartError) {
      showError(clusterChartError.message)
    }
  }, [error, logsError, clusterChartError])

  const onTabChange = (tab: string) => {
    if (tab === LOGS_TAB) {
      if (!logsData) {
        goToLogsPage(0)
      }
      if (!clusterChartData) {
        fetchClusterChartData({
          queryParams: { accountId }
        })
      }
    }
    setSelectedTab(tab)
  }

  const goToPage = (page: number) => {
    fetchTimeseries({
      queryParams: {
        accountId: accountId,
        anomalousMetricsOnly,
        pageNumber: page
      }
    })
  }

  const goToLogsPage = (page: number) => {
    fetchLogAnalyses({
      queryParams: {
        accountId,
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
            <Tabs id="tabs1" onChange={onTabChange} selectedTabId={selectedTab}>
              <Tab title="Metrics" id={METRICS_TAB} />
              <Tab title="Logs" id={LOGS_TAB} />
            </Tabs>
          </Container>
          {selectedTab === METRICS_TAB && (
            <DeploymentMetricsTab data={data} goToPage={goToPage} onAnomalousMetricsOnly={setAnomalousMetricsOnly} />
          )}
          {selectedTab === LOGS_TAB && (
            <DeploymentLogsTab data={logsData} clusterChartData={clusterChartData} goToPage={goToLogsPage} />
          )}
        </Container>
      </Container>
      {(loading || logsLoading || clusterChartLoading) && <PageSpinner />}
    </Page.Body>
  )
}
