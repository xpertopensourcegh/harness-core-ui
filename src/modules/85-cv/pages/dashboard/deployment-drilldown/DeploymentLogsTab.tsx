import React, { useMemo } from 'react'
import { Container, Pagination, Text } from '@wings-software/uicore'
import type {
  RestResponsePageLogAnalysisClusterDTO,
  RestResponseListLogAnalysisClusterChartDTO,
  LogData
} from 'services/cv'
import { getRiskColorValue } from '@common/components/HeatMap/ColorUtils'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { useStrings } from 'framework/exports'
import ClusterChart from './ClusterChart'
import {
  LogAnalysisRow,
  LogAnalysisRowData
} from '../../services/analysis-drilldown-view/LogAnalysisView/LogAnalysisRow/LogAnalysisRow'
import styles from './DeploymentDrilldownView.module.scss'

export interface DeploymentLogsTabProps {
  data: RestResponsePageLogAnalysisClusterDTO | null
  clusterChartData: RestResponseListLogAnalysisClusterChartDTO | null
  goToPage(val: number): void
  isLoading: boolean
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

export default function DeploymentLogsTab({ data, clusterChartData, goToPage, isLoading }: DeploymentLogsTabProps) {
  const { getString } = useStrings()
  const logAnalysisData = useMemo((): LogAnalysisRowData[] => {
    return (
      data?.resource?.content?.map(d => ({
        clusterType: mapClusterType(d.clusterType!),
        count: d.count!,
        message: d.message!,
        messageFrequency: [
          {
            name: 'testData',
            type: 'line',
            color: getRiskColorValue(d.risk),
            data: d!.testFrequencyData
          },
          {
            name: 'controlData',
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
      <Container className={styles.panel}>
        <Text font={{ weight: 'bold' }}>{getString('cv.logCluster')}</Text>
        <ClusterChart data={clusterChartData?.resource || []} />
      </Container>
      <Text font={{ weight: 'bold' }} margin={{ top: 'small', bottom: 'small' }}>
        {getString('cv.logsCluster')}
      </Text>
      <Container className={styles.tableContent}>
        {!logAnalysisData.length && !isLoading && (
          <NoDataCard message={getString('cv.noAnalysis')} icon="warning-sign" />
        )}
        {!!logAnalysisData.length && <LogAnalysisRow className={styles.logAnalysisRow} data={logAnalysisData} />}
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
