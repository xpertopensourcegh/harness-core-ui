import React, { useMemo } from 'react'
import { Container, Pagination, Text } from '@wings-software/uikit'
import type {
  RestResponsePageLogAnalysisClusterDTO,
  RestResponseListLogAnalysisClusterChartDTO,
  LogData
} from 'services/cv'
import { getColorValue } from 'modules/common/components/HeatMap/ColorUtils'
import ClusterChart from './ClusterChart'
import i18n from './DeploymentDrilldownView.i18n'
import {
  LogAnalysisRow,
  LogAnalysisRowData
} from '../../services/analysis-drilldown-view/LogAnalysisView/LogAnalysisRow/LogAnalysisRow'
import styles from './DeploymentDrilldownView.module.scss'

export interface DeploymentLogsTabProps {
  data: RestResponsePageLogAnalysisClusterDTO | null
  clusterChartData: RestResponseListLogAnalysisClusterChartDTO | null
  goToPage(val: number): void
}

const mapClusterType = (type: string): LogData['tag'] => {
  switch (type) {
    case 'KNOWN_EVENT':
      return 'KNOWN'
    case 'UNKNOWN_EVENT':
      return 'UNKNOWN'
    default:
      return
  }
}

export default function DeploymentLogsTab({ data, clusterChartData, goToPage }: DeploymentLogsTabProps) {
  const logAnalysisData = useMemo((): LogAnalysisRowData[] => {
    return (
      data?.resource?.content?.map(d => ({
        clusterType: mapClusterType(d.clusterType!),
        count: d.count!,
        message: d.message!,
        messageFrequency: [
          {
            name: 'one',
            type: 'line',
            color: getColorValue(d.risk!),
            data: d!.testFrequencyData
          },
          {
            name: 'two',
            type: 'line',
            color: 'var(--grey-350)',
            data: d!.controlFrequencyData
          }
        ]
      })) ?? []
    )
  }, [data])
  return (
    <Container className={styles.logsTab}>
      <Text font={{ weight: 'bold' }}>{i18n.logCluster}</Text>
      <ClusterChart data={clusterChartData?.resource || []} />
      <Container className={styles.tableContent}>
        <LogAnalysisRow className={styles.logAnalysisRow} data={logAnalysisData} />
      </Container>
      {!!data?.resource?.totalPages && (
        <Pagination
          pageSize={data.resource.pageSize as number}
          pageCount={data.resource.totalPages + 1}
          itemCount={data.resource.totalItems as number}
          pageIndex={data.resource.pageIndex}
          gotoPage={goToPage}
        />
      )}
    </Container>
  )
}
