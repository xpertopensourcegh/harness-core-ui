import React, { useState, useEffect } from 'react'
import { Container, Tabs, Tab, Button, Text } from '@wings-software/uikit'
import {
  useGetVerificationInstances,
  useGetDeploymentTimeSeries,
  HostData,
  useGetDeploymentLogAnalyses,
  useGetClusterChartAnalyses
} from 'services/cv'
import { Page } from 'modules/common/exports'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { useRouteParams } from 'framework/exports'
import { useToaster } from 'modules/common/exports'
import DeploymentMetricsTab from './DeploymentMetricsTab'
import DeploymentLogsTab from './DeploymentLogsTab'
import DeploymentDrilldownViewHeader from './DeploymentDrilldownViewHeader'
import DeploymentDrilldownSideNav from './DeploymentDrilldownSideNav'
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
    params: { accountId, projectIdentifier, deploymentTag }
  } = useRouteParams()
  const { showError } = useToaster()
  const [anomalousMetricsOnly, setAnomalousMetricsOnly] = useState<boolean>(true)
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_SELECTED_TAB)
  const [verificationInstance, setVerificationInstance] = useState<any>()

  const {
    data: activityVerifications,
    loading: activityVerificationsLoading,
    error: activityVerificationsError
  } = useGetVerificationInstances({
    deploymentTag: deploymentTag as string,
    queryParams: {
      accountId: accountId as string,
      projectIdentifier: projectIdentifier as string
    }
  })

  const {
    data: timeseriesData,
    loading: timeseriesLoading,
    error: timeseriesError,
    refetch: fetchTimeseries
  } = useGetDeploymentTimeSeries({
    verificationJobInstanceId: verificationInstance?.verificationJobInstanceId,
    queryParams: {
      accountId: accountId,
      anomalousMetricsOnly
    },
    lazy: true
  })

  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    refetch: fetchLogAnalyses
  } = useGetDeploymentLogAnalyses({
    verificationJobInstanceId: verificationInstance?.verificationJobInstanceId,
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
    verificationJobInstanceId: verificationInstance?.verificationJobInstanceId,
    queryParams: {
      accountId
    },
    lazy: true
  })

  const {
    preProductionDeploymentVerificationJobInstanceSummaries: preProduction,
    postDeploymentVerificationJobInstanceSummaries: postDeployment,
    productionDeploymentVerificationJobInstanceSummaries: productionDeployment
  } = activityVerifications?.resource?.deploymentResultSummary || {}

  useEffect(() => {
    if (activityVerifications?.resource) {
      const instance =
        (preProduction?.length && preProduction[0]) ||
        (postDeployment?.length && postDeployment[0]) ||
        (productionDeployment?.length && productionDeployment[0])
      if (instance) {
        setVerificationInstance(instance)
      }
    }
  }, [activityVerifications])

  useEffect(() => {
    if (verificationInstance?.verificationJobInstanceId) {
      if (selectedTab === METRICS_TAB) {
        goToTimeseriesPage(0)
      } else {
        goToLogsPage(0)
        fetchClusterChartData({
          queryParams: { accountId }
        })
      }
    }
  }, [verificationInstance])

  useEffect(() => {
    if (activityVerificationsError) {
      showError(activityVerificationsError.message)
    } else if (timeseriesError) {
      showError(timeseriesError.message)
    } else if (logsError) {
      showError(logsError.message)
    } else if (clusterChartError) {
      showError(clusterChartError.message)
    }
  }, [activityVerificationsError, timeseriesError, logsError, clusterChartError])

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
    } else if (!timeseriesData) {
      goToTimeseriesPage(0)
    }
    setSelectedTab(tab)
  }

  const goToTimeseriesPage = (page: number) => {
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
      <DeploymentDrilldownViewHeader
        deploymentTag={decodeURIComponent(deploymentTag as string)}
        environments={activityVerifications?.resource?.environments}
        service={activityVerifications?.resource?.serviceName}
      />
      <Container className={styles.body}>
        <DeploymentDrilldownSideNav
          selectedInstance={verificationInstance}
          onSelect={item => setVerificationInstance(item)}
          preProductionInstances={preProduction}
          postDeploymentInstances={postDeployment}
          productionDeployment={productionDeployment}
        />
        <Container className={styles.content}>
          <Container className={styles.subHeader}>
            <Text font={{ weight: 'bold' }}>{verificationInstance?.jobName}</Text>
            <Container>
              <Button minimal icon="symbol-square" text="Stop Deployment" disabled />
              <Button minimal icon="refresh" text="Rollback" disabled />
              <Button minimal icon="share" text="Share" disabled />
              <Button minimal icon="service-jira" text="Create Ticket" disabled />
            </Container>
          </Container>
          <Container className={styles.filters}>
            <Tabs id="tabs1" onChange={onTabChange} selectedTabId={selectedTab}>
              <Tab title="Metrics" id={METRICS_TAB} />
              <Tab title="Logs" id={LOGS_TAB} />
            </Tabs>
          </Container>
          {selectedTab === METRICS_TAB && (
            <DeploymentMetricsTab
              data={timeseriesData}
              goToPage={goToTimeseriesPage}
              isLoading={timeseriesLoading}
              onAnomalousMetricsOnly={val => {
                setAnomalousMetricsOnly(val)
                fetchTimeseries({
                  queryParams: {
                    accountId: accountId,
                    anomalousMetricsOnly: val
                  }
                })
              }}
            />
          )}
          {selectedTab === LOGS_TAB && (
            <DeploymentLogsTab
              data={logsData}
              clusterChartData={clusterChartData}
              isLoading={logsLoading}
              goToPage={goToLogsPage}
            />
          )}
        </Container>
      </Container>
      {(activityVerificationsLoading || timeseriesLoading || logsLoading || clusterChartLoading) && <PageSpinner />}
    </Page.Body>
  )
}
