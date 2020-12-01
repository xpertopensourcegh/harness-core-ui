import React, { useState, useEffect } from 'react'
import { useGet } from 'restful-react'
import { Container, Tabs, Tab, Text } from '@wings-software/uikit'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import CVProgressBar from '@cv/components/CVProgressBar/CVProgressBar'
import { ActivitiesFlagBorder } from '@cv/components/ActivitiesTimelineView/ActivitiesTimelineView'
import ActivitiesTimelineViewSection from '@cv/components/ActivitiesTimelineView/ActivitiesTimelineViewSection'
import { TimelineBar } from '@common/components/TimelineView/TimelineBar'
import CVPagination from '@cv/components/CVPagination/CVPagination'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { riskScoreToColor } from '@cv/pages/services/analysis-drilldown-view/MetricAnalysisView/MetricsAnalysisRow/MetricAnalysisRow'
import VerificationStatusBar from '../activity-changes-drilldown/VerificationStatusBar'
import { TabIdentifier } from './VerificationInstanceView'
import {
  MetricAnalysisFilter,
  MetricAnalysisFilterType
} from '../../services/analysis-drilldown-view/MetricAnalysisView/MetricAnalysisFilter/MetricAnalysisFilter'
import TimeseriesRow, { TimeseriesRowProps } from '../../../components/TimeseriesRow/TimeseriesRow'
import { LogAnalysisRow } from '../../services/analysis-drilldown-view/LogAnalysisView/LogAnalysisRow/LogAnalysisRow'
import i18n from './DeploymentDrilldownView.i18n'
import { ActivityLogAnalysisFrequencyChart } from '../../services/analysis-drilldown-view/LogAnalysisView/LogAnalysisFrequencyChart/LogAnalysisFrequencyChart'
import styles from './DeploymentDrilldownView.module.scss'

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

export default function VerificationInstacePostDeploymentView({
  selectedActivityId,
  activityStartTime,
  durationMs,
  environmentIdentifier,
  onActivityLoaded
}: VerificationInstacePostDeploymentViewProps): React.ReactElement {
  const rangeStartTime = activityStartTime - 2 * 60 * 60000
  const rangeEndTime = activityStartTime + durationMs
  const { accountId } = useParams()
  const { data: activityWithRisks } = useGet(`/cv/api/activity/${selectedActivityId}/activity-risks`, {
    queryParams: {
      accountId
    }
  })

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
            startTime={activityWithRisks?.resource?.activityStartTime}
            remainingTimeMs={activityWithRisks?.resource?.remainingTimeMs}
            cumulativeRisk={activityWithRisks?.resource?.overallRisk}
            scoresBeforeChanges={activityWithRisks?.resource?.preActivityRisks}
            scoresAfterChanges={activityWithRisks?.resource?.postActivityRisks}
          />
        )}
      </Container>
      {!!rangeStartTime && !!rangeEndTime && (
        <>
          <Container className={styles.panel}>
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
    },
    hideShowMore: true
  }))
}

export function getSeriesZones(items: any[], mapColor = riskScoreToColor) {
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
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [metricsData, setMetricsData] = useState<Array<TimeseriesRowProps>>()
  const [anomalousOnly, setAnomalousOnly] = useState(true)
  const { data, refetch, loading } = useGet(`/cv/api/timeseries-dashboard/${activityId}/metrics`, {
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
      <CVPagination page={data?.resource} goToPage={goToPage} />
    </Container>
  )
}

function LogsTab({ activityId, environmentIdentifier, startTime, endTime }: LogsTabProps) {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [logsData, setLogsData] = useState()
  const { data, refetch, loading } = useGet(`/cv/api/log-dashboard/${activityId}/logs`, {
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      environmentIdentifier,
      startTime,
      endTime,
      page: 0
    },
    resolve: res => {
      if (res?.resource?.content?.length) {
        setLogsData(
          res.resource.content.map(({ logData }: any) => ({
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
        startTime,
        endTime,
        page
      }
    })

  return (
    <Container>
      <Container className={classnames(styles.frequencyChart, styles.panel)}>
        <Container className={styles.frequencyChartContent}>
          <Text font={{ weight: 'bold' }}>{`${i18n.logCluster} ${i18n.timeline}`}</Text>
          <ActivityLogAnalysisFrequencyChart
            activityId={activityId}
            projectIdentifier={projectIdentifier as string}
            orgIdentifier={orgIdentifier as string}
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
      <CVPagination page={data?.resource} goToPage={goToPage} />
    </Container>
  )
}
