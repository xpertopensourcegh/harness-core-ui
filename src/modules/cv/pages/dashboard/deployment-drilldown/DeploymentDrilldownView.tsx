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
import { DeploymentProgressAndNodes } from 'modules/cv/components/DeploymentProgressAndNodes/DeploymentProgressAndNodes'
import type { NodeData } from '../../services/BlueGreenVerificationChart'
import DeploymentMetricsTab from './DeploymentMetricsTab'
import DeploymentLogsTab from './DeploymentLogsTab'
import DeploymentDrilldownViewHeader from './DeploymentDrilldownViewHeader'
import DeploymentDrilldownSideNav, { InstancePhase } from './DeploymentDrilldownSideNav'
import styles from './DeploymentDrilldownView.module.scss'

export interface TransactionRowProps {
  transactionName?: string
  metricName?: string
  nodes?: HostData[]
}

const METRICS_TAB = 'METRICS_TAB'
const LOGS_TAB = 'LOGS_TAB'
const DEFAULT_SELECTED_TAB = METRICS_TAB

export default function DeploymentDrilldownView(): JSX.Element {
  const {
    params: { accountId, projectIdentifier, orgIdentifier, deploymentTag, serviceIdentifier }
  } = useRouteParams()
  const { showError } = useToaster()
  const [anomalousMetricsOnly, setAnomalousMetricsOnly] = useState<boolean>(true)
  const [selectedNode, setSelectedNode] = useState<NodeData | undefined>()
  const [selectedTab, setSelectedTab] = useState<string>(DEFAULT_SELECTED_TAB)
  const [verificationInstance, setVerificationInstance] = useState<any>()
  const [instancePhase, setInstancePhase] = useState<InstancePhase>()

  const {
    data: activityVerifications,
    loading: activityVerificationsLoading,
    error: activityVerificationsError
  } = useGetVerificationInstances({
    deploymentTag: deploymentTag as string,
    queryParams: {
      accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      serviceIdentifier: serviceIdentifier as string
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
      anomalousMetricsOnly,
      hostName: selectedNode?.hostName
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
      let defaultInstance
      let defaultPhase
      if (preProduction?.length) {
        defaultInstance = preProduction[0]
        defaultPhase = InstancePhase.PRE_PRODUCTION
      } else if (productionDeployment?.length) {
        defaultInstance = productionDeployment[0]
        defaultPhase = InstancePhase.PRODUCTION
      } else if (postDeployment?.length) {
        defaultInstance = postDeployment[0]
        defaultPhase = InstancePhase.POST_DEPLOYMENT
      }
      if (defaultInstance) {
        setVerificationInstance(defaultInstance)
        setInstancePhase(defaultPhase)
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
        hostName: selectedNode?.hostName,
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
          onSelect={(item, phase) => {
            setVerificationInstance(item)
            setInstancePhase(phase)
          }}
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
          <DeploymentProgressAndNodes
            deploymentSummary={verificationInstance}
            instancePhase={instancePhase}
            onSelectNode={(node: NodeData) => {
              setSelectedNode(node)
              fetchTimeseries({
                queryParams: {
                  accountId,
                  anomalousMetricsOnly,
                  hostName: node?.hostName
                }
              })
            }}
          />
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
                    anomalousMetricsOnly: val,
                    hostName: selectedNode?.hostName
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
