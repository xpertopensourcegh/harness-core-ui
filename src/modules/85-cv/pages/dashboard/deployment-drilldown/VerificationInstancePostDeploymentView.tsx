import React, { useState, useEffect } from 'react'
import { Container, Tabs, Tab, Text, Link, useModalHook, Icon, Color, Pagination } from '@wings-software/uicore'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import MonacoEditor from 'react-monaco-editor'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import CVProgressBar from '@cv/components/CVProgressBar/CVProgressBar'
import { ActivitiesFlagBorder } from '@cv/components/ActivitiesTimelineView/ActivitiesTimelineView'
import ActivitiesTimelineViewSection from '@cv/components/ActivitiesTimelineView/ActivitiesTimelineViewSection'
import { TimelineBar } from '@common/components/TimelineView/TimelineBar'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { getRiskColorValue } from '@common/components/HeatMap/ColorUtils'
import {
  useGetActivityDetails,
  useGetActivityMetrics,
  useGetActivityVerificationResult,
  useGetActivityLogs
} from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { PageError } from '@common/components/Page/PageError'
import VerificationStatusBar from '../activity-changes-drilldown/VerificationStatusBar'
import { TabIdentifier } from './VerificationInstanceView'
import {
  MetricAnalysisFilter,
  MetricAnalysisFilterType
} from '../../services/analysis-drilldown-view/MetricAnalysisView/MetricAnalysisFilter/MetricAnalysisFilter'
import TimeseriesRow, { TimeseriesRowProps } from '../../../components/TimeseriesRow/TimeseriesRow'
import {
  LogAnalysisRow,
  LogAnalysisRowData
} from '../../services/analysis-drilldown-view/LogAnalysisView/LogAnalysisRow/LogAnalysisRow'
import i18n from './DeploymentDrilldownView.i18n'
import { ActivityLogAnalysisFrequencyChart } from '../../services/analysis-drilldown-view/LogAnalysisView/LogAnalysisFrequencyChart/LogAnalysisFrequencyChart'
import styles from './DeploymentDrilldownView.module.scss'

const bpDialogProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  title: '',
  style: { width: 900, height: 570 }
}

export interface VerificationInstacePostDeploymentViewProps {
  selectedActivityId: string
  activityStartTime: number
  durationMs: number
  environmentIdentifier: string
  onActivityLoaded?(activity: any): void
}

interface MetricsTabProps {
  activityId: string
  environmentIdentifier: string
  startTime: number
  endTime: number
  selectedActivityStartTime?: number
}

interface LogsTabProps {
  activityId: string
  environmentIdentifier: string
  startTime: number
  endTime: number
}

function KubernetesEvents({ selectedActivityId }: { selectedActivityId: string }): JSX.Element {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { error: eventsError, loading: eventsLoading, data: eventsData, refetch } = useGetActivityDetails({
    activityId: selectedActivityId,
    queryParams: { projectIdentifier, orgIdentifier, accountId }
  })
  if (eventsError?.message) {
    return <PageError message={eventsError.message} onClick={() => refetch()} />
  }

  if (eventsLoading) {
    return (
      <Container className={styles.eventsLoading}>
        <Icon name="steps-spinner" size={25} color={Color.GREY_600} />
      </Container>
    )
  }

  return (
    <Container className={styles.eventsEditor}>
      <MonacoEditor
        language="json"
        height={570}
        value={JSON.stringify(eventsData?.data, null, 4)?.replace(/\\n/g, '\r\n')}
        options={
          {
            readOnly: true,
            wordBasedSuggestions: false,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 13
          } as any
        }
      />
    </Container>
  )
}

export default function VerificationInstacePostDeploymentView({
  selectedActivityId,
  activityStartTime,
  durationMs,
  environmentIdentifier,
  onActivityLoaded
}: VerificationInstacePostDeploymentViewProps): React.ReactElement {
  const rangeStartTime = activityStartTime - 2 * 60 * 60000
  const rangeEndTime = activityStartTime + durationMs
  const { accountId } = useParams<ProjectPathProps>()
  const { data: activityWithRisks } = useGetActivityVerificationResult({
    activityId: selectedActivityId,
    queryParams: {
      accountId
    }
  })

  const [openModal, closeModal] = useModalHook(
    () => (
      <Dialog {...bpDialogProps} isOpen={true} onClose={closeModal} title={activityWithRisks?.resource?.activityName}>
        <KubernetesEvents selectedActivityId={selectedActivityId} />
      </Dialog>
    ),
    [selectedActivityId, activityWithRisks?.resource?.activityName]
  )

  useEffect(() => {
    if (activityWithRisks?.resource) {
      onActivityLoaded?.(activityWithRisks.resource)
    }
  }, [activityWithRisks])

  return (
    <Container className={styles.postDeploymentView}>
      <Container className={styles.panel}>
        <CVProgressBar
          value={activityWithRisks?.resource?.progressPercentage}
          status={activityWithRisks?.resource?.status}
        />
        {activityWithRisks && (
          <VerificationStatusBar
            status={activityWithRisks?.resource?.status}
            startTime={activityWithRisks?.resource?.activityStartTime as number}
            remainingTimeMs={activityWithRisks?.resource?.remainingTimeMs as number}
            cumulativeRisk={activityWithRisks?.resource?.overallRisk as number}
            scoresBeforeChanges={activityWithRisks?.resource?.preActivityRisks || []}
            scoresAfterChanges={activityWithRisks?.resource?.postActivityRisks || []}
          />
        )}
        {activityWithRisks?.resource?.activityType === 'KUBERNETES' && (
          <Link
            minimal
            withoutHref
            text="View Kubernetes Events"
            className={styles.kubernetesButton}
            onClick={() => openModal()}
          />
        )}
      </Container>
      {!!rangeStartTime && !!rangeEndTime && (
        <>
          <Container className={classnames(styles.panel, styles.activitiesTimelineViewPanel)}>
            <ActivitiesTimelineViewSection
              environmentIdentifier={environmentIdentifier}
              selectedActivityId={selectedActivityId}
              startTime={rangeStartTime}
              endTime={rangeEndTime}
            />
          </Container>
          <Tabs id="tabs1">
            <Tab
              title={i18n.metrics}
              id={TabIdentifier.METRICS_TAB}
              panel={
                <Container className={styles.panel}>
                  <MetricsTab
                    activityId={selectedActivityId}
                    environmentIdentifier={environmentIdentifier}
                    startTime={rangeStartTime}
                    endTime={rangeEndTime}
                    selectedActivityStartTime={activityStartTime}
                  />
                </Container>
              }
            />
            <Tab
              title={i18n.logs}
              id={TabIdentifier.LOGS_TAB}
              panel={
                <Container>
                  <LogsTab
                    activityId={selectedActivityId}
                    environmentIdentifier={environmentIdentifier}
                    startTime={rangeStartTime}
                    endTime={rangeEndTime}
                  />
                </Container>
              }
            />
          </Tabs>
        </>
      )}
    </Container>
  )
}

export function mapMetricsData(res: any, startTime: number, endTime: number, activityStartTime: number) {
  return res?.resource?.content.map((item: any) => ({
    transactionName: item.groupName,
    metricName: item.metricName,
    seriesData: [
      {
        series: [
          {
            type: 'line',
            color: 'var(--green-500)',
            data: item.metricDataList.map((val: any) => ({
              x: val.timestamp,
              y: val.value
            })),
            zoneAxis: 'x',
            zones: getSeriesZones(item.metricDataList)
          }
        ]
      }
    ],
    chartOptions: {
      chart: {
        height: 50,
        spacing: [5, 0, 5, 12]
      },
      xAxis: {
        min: startTime,
        max: endTime,
        plotBands: [
          {
            color: 'var(--blue-200)',
            from: activityStartTime,
            to: endTime
          }
        ]
      }
    }
  }))
}

export function getSeriesZones(items: any[], mapColor = getRiskColorValue) {
  const zones = []
  for (let i = 0; i < items.length; i++) {
    const prevRisk = i > 0 ? items[i - 1].risk : undefined
    const prevTimestamp = prevRisk && items[i - 1].timestamp
    if (items[i].risk !== prevRisk && !!prevRisk) {
      zones.push({
        value: prevTimestamp,
        color: mapColor(prevRisk)
      })
    }
    if (i === items.length - 1) {
      zones.push({
        value: items[i].timestamp,
        color: mapColor(items[i].risk)
      })
    }
  }
  return zones
}

function MetricsTab({
  activityId,
  environmentIdentifier,
  startTime,
  endTime,
  selectedActivityStartTime
}: MetricsTabProps) {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const [metricsData, setMetricsData] = useState<Array<TimeseriesRowProps>>()
  const [anomalousOnly, setAnomalousOnly] = useState(true)
  const { data, refetch, loading } = useGetActivityMetrics({
    activityId,
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      environmentIdentifier,
      anomalousOnly,
      startTime,
      endTime,
      page: 0
    },
    resolve: res => {
      if (res?.resource?.content) {
        setMetricsData(mapMetricsData(res, startTime, endTime, selectedActivityStartTime as number))
      }
      return res
    }
  })
  const goToPage = (page: number) =>
    refetch({
      queryParams: {
        accountId,
        projectIdentifier,
        orgIdentifier,
        environmentIdentifier,
        anomalousOnly,
        startTime,
        endTime,
        page
      }
    })
  return (
    <Container className={styles.postDeploymentMetrics}>
      <Container className={styles.filtersAndStatusBar}>
        <Container width={215}>
          <MetricAnalysisFilter onChangeFilter={val => setAnomalousOnly(val === MetricAnalysisFilterType.ANOMALOUS)} />
        </Container>
        <TimelineBar className={styles.timelineBar} startDate={startTime} endDate={endTime} />
      </Container>
      {!data?.resource?.content?.length && !loading && (
        <NoDataCard className={styles.noDataCard} message={i18n.nothingToDisplay} icon="warning-sign" />
      )}
      {metricsData?.map((mData: TimeseriesRowProps, index: number) => (
        <TimeseriesRow
          key={`${mData.transactionName}${mData.metricName}${index}`}
          className={styles.seriesRow}
          {...mData}
        />
      ))}
      <ActivitiesFlagBorder />
      {(!!data?.resource && (data.resource.pageIndex ?? -1) >= 0 && (
        <Pagination
          pageSize={data.resource.pageSize as number}
          pageCount={data.resource.totalPages as number}
          itemCount={data.resource.totalItems as number}
          pageIndex={data.resource.pageIndex}
          gotoPage={p => goToPage?.(p)}
        />
      )) ||
        null}
    </Container>
  )
}

function LogsTab({ activityId, environmentIdentifier, startTime, endTime }: LogsTabProps) {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const [logsData, setLogsData] = useState<LogAnalysisRowData[]>([])
  const { data, refetch, loading } = useGetActivityLogs({
    activityId,
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      environmentIdentifier,
      startTime,
      endTime,
      page: 0
    }
  })
  const goToPage = (page: number) =>
    refetch({
      queryParams: {
        accountId,
        projectIdentifier,
        orgIdentifier,
        environmentIdentifier,
        startTime,
        endTime,
        page
      }
    })

  useEffect(() => {
    if (data?.resource?.content?.length) {
      setLogsData(
        data.resource.content.map(({ logData }: any) => ({
          clusterType: logData.tag,
          count: logData.count,
          message: logData.text,
          messageFrequency: [
            {
              type: 'line',
              color: 'var(--green-500)',
              data: logData?.trend
                ?.sort((a: any, b: any) => a.timestamp - b.timestamp)
                .map((d: any) => ({
                  x: d.timestamp,
                  y: d.count
                }))
            }
          ]
        }))
      )
    } else {
      setLogsData([])
    }
  }, [data])

  return (
    <Container>
      <Container className={classnames(styles.frequencyChart, styles.panel)}>
        <Container className={styles.frequencyChartContent}>
          <Text font={{ weight: 'bold' }}>{`${i18n.logCluster} ${i18n.timeline}`}</Text>
          <ActivityLogAnalysisFrequencyChart
            activityId={activityId}
            projectIdentifier={projectIdentifier}
            orgIdentifier={orgIdentifier}
            startTime={startTime}
            endTime={endTime}
          />
        </Container>
        <ActivitiesFlagBorder />
      </Container>
      {logsData && <LogAnalysisRow data={logsData!} />}
      {!data?.resource?.content?.length && !loading && (
        <NoDataCard className={styles.noDataCard} message={i18n.nothingToDisplay} icon="warning-sign" />
      )}
      {(!!data?.resource && (data.resource.pageIndex ?? -1) >= 0 && (
        <Pagination
          pageSize={data.resource.pageSize as number}
          pageCount={data.resource.totalPages as number}
          itemCount={data.resource.totalItems as number}
          pageIndex={data.resource.pageIndex}
          gotoPage={p => goToPage?.(p)}
        />
      )) ||
        null}
    </Container>
  )
}
