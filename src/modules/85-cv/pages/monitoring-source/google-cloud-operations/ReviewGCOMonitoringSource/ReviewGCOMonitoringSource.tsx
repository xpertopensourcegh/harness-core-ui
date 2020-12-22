import React, { useEffect } from 'react'
import { Color, Container, Heading, Text } from '@wings-software/uikit'
import { useHistory, useParams } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Table, useToaster } from '@common/components'
import { String, useStrings } from 'framework/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { BaseSetupTabsObject, ONBOARDING_ENTITIES } from '@cv/pages/admin/setup/SetupUtils'
import routes from '@common/RouteDefinitions'
import { useSaveDSConfig } from 'services/cv'
import type {
  GCODSConfig,
  // GCOMetricDefinition,
  GCOMonitoringSourceInfo
} from '../GoogleCloudOperationsMonitoringSourceUtils'
import css from './ReviewGCOMonitoringSource.module.scss'

interface ReviewGCOMonitoringSourceProps {
  onSubmit: (data: BaseSetupTabsObject & GCOMonitoringSourceInfo) => void
  onPrevious: () => void
  data: GCOMonitoringSourceInfo
}

type TableData = {
  metricName: string
  service: string
  environment: string
}

function TableColumn(props: CellProps<TableData>): JSX.Element {
  return <Text color={Color.BLACK}>{props.value}</Text>
}

function transformIncomingData(data: GCOMonitoringSourceInfo): { tableData: TableData[]; services: string[] } {
  if (!data?.selectedMetrics?.size) {
    return { tableData: [], services: [] }
  }

  const tableData: TableData[] = []
  const services = new Set<string>()
  for (const selectedMetricInfo of data.selectedMetrics) {
    const [selectedMetric, metricInfo] = selectedMetricInfo
    if (!metricInfo.service || !metricInfo.environment || !selectedMetricInfo) continue
    services.add(metricInfo.service.label)
    tableData.push({
      service: metricInfo.service.label,
      environment: metricInfo.environment.label,
      metricName: selectedMetric
    })
  }

  return { tableData, services: Array.from(services.values()) }
}

// function metricLabelToMetricType(metricLabel: string): GCOMetricDefinition['riskProfile']['metricType'] {
//   switch (metricLabel) {
//     case 'Errors':
//       return 'ERROR'
//     case 'Infrastructure':
//       return 'INFRA'
//     case 'Throughput':
//       return 'THROUGHPUT'
//     case 'Response Time':
//       return 'RESP_TIME'
//     case 'Apdex':
//       return 'APDEX'
//     case 'Other':
//     default:
//       return 'OTHER' as GCOMetricDefinition['riskProfile']['metricType'] // getting type issue for this
//   }
// }

function transformToSavePayload(_data: GCOMonitoringSourceInfo): GCODSConfig {
  return {} as GCODSConfig
  // if (!data?.selectedMetrics?.size) {
  //   return []
  // }

  // const gcoDSConfigs = new Map<string, GCODSConfig>()
  // for (const selectedMetricInfo of data.selectedMetrics) {
  //   const [selectedMetric, metricInfo] = selectedMetricInfo
  //   if (!selectedMetric || !metricInfo) continue
  //   const existingDSConfig: GCODSConfig = gcoDSConfigs.get(
  //     `${metricInfo.service?.value as string}-${metricInfo.environment?.value as string}`
  //   ) || {
  //     connectorIdentifier: data.connectorRef?.value as string,
  //     accountId: data.accountId,
  //     type: 'STACKDRIVER',
  //     envIdentifier: metricInfo.environment?.value as string,
  //     serviceIdentifier: metricInfo.service?.value as string,
  //     identifier: data.identifier,
  //     projectIdentifier: data.projectIdentifier,
  //     metricDefinitions: [],
  //     metricPacks: data.metricPacks || []
  //   }

  //   const [category, metricType] = metricInfo.riskCategory?.split('/') || []
  //   const thresholdTypes: GCOMetricDefinition['riskProfile']['thresholdTypes'] = []
  //   if (metricInfo.lowerBaselineDeviation) {
  //     thresholdTypes.push('ACT_WHEN_LOWER')
  //   }
  //   if (metricInfo.higherBaselineDeviation) {
  //     thresholdTypes.push('ACT_WHEN_HIGHER')
  //   }
  //   existingDSConfig.metricDefinitions.push({
  //     dashboardName: metricInfo.dashboardName as string,
  //     metricName: metricInfo.metricName as string,
  //     metricTags: Object.keys(metricInfo.metricTags || {}),
  //     jsonMetricDefinition: JSON.parse(metricInfo.query || ''),
  //     riskProfile: {
  //       metricType: metricLabelToMetricType(metricType),
  //       category: category as GCOMetricDefinition['riskProfile']['category'],
  //       thresholdTypes
  //     }
  //   })

  //   gcoDSConfigs.set(
  //     `${metricInfo.service?.value as string}-${metricInfo.environment?.value as string}`,
  //     existingDSConfig
  //   )
  // }

  // return Array.from(gcoDSConfigs.values())
}

export function ReviewGCOMonitoringSource(props: ReviewGCOMonitoringSourceProps): JSX.Element {
  const { onSubmit, onPrevious, data } = props
  const history = useHistory()
  const params = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { mutate: saveDSConfigs, error } = useSaveDSConfig({ queryParams: { ...params } })
  const { tableData, services } = transformIncomingData(data)

  useEffect(() => {
    if (error?.message) showError(error.message, 5000)
  }, [error?.message])

  return (
    <Container className={css.main}>
      <Heading level={2} className={css.heading}>
        <String
          stringID="cv.monitoringSources.gco.reviewPage.mappedMetrics"
          vars={{ metricCount: Array.from(data?.selectedMetrics?.keys())?.length, serviceCount: services.length }}
        />
      </Heading>
      <Table<TableData>
        data={tableData}
        className={css.reviewTable}
        columns={[
          {
            Header: getString('cv.monitoringSources.gco.reviewPage.gcoMetrics'),
            accessor: 'metricName',
            width: '25%',
            Cell: TableColumn
          },
          {
            Header: getString('cv.harnessService'),
            accessor: 'service',
            width: '25%',
            Cell: TableColumn
          },
          {
            Header: `${getString('cv.harnessEnvironment')}`,
            accessor: 'environment',
            width: '25%',
            Cell: TableColumn
          }
        ]}
      />
      <SubmitAndPreviousButtons
        onPreviousClick={onPrevious}
        nextButtonProps={{
          text: getString('submit')
        }}
        onNextClick={async () => {
          await saveDSConfigs(transformToSavePayload(data))
          onSubmit({
            ...data,
            sourceType: ONBOARDING_ENTITIES.MONITORING_SOURCE as BaseSetupTabsObject['sourceType']
          })
          history.push(`${routes.toCVAdminSetup(params)}?step=1`)
        }}
      />
    </Container>
  )
}
