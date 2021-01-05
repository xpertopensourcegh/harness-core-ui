import React, { useEffect } from 'react'
import { Color, Container, Heading, Text } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Table, useToaster } from '@common/components'
import { String, useStrings } from 'framework/exports'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { BaseSetupTabsObject, ONBOARDING_ENTITIES } from '@cv/pages/admin/setup/SetupUtils'
import routes from '@common/RouteDefinitions'
import { TimeSeriesMetricDefinition, useSaveDSConfig } from 'services/cv'
import type { GCODSConfig, GCODefinition, GCOMonitoringSourceInfo } from '../GoogleCloudOperationsMonitoringSourceUtils'
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
  return (
    <Text color={Color.BLACK} lineClamp={1} width="100%" className={css.textOverflow}>
      {props.value}
    </Text>
  )
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

function transformToSavePayload(data: GCOMonitoringSourceInfo): GCODSConfig {
  if (!data?.selectedMetrics?.size) {
    return { metricConfigurations: [] }
  }

  const gcoDSConfig: GCODSConfig = {
    metricConfigurations: [],
    identifier: data.identifier,
    orgIdentifier: data.orgIdentifier,
    projectIdentifier: data.projectIdentifier,
    monitoringSourceName: data.name,
    type: 'STACKDRIVER',
    connectorIdentifier: data.connectorRef?.value as string,
    accountId: data.accountId
  }
  for (const selectedMetricInfo of data.selectedMetrics) {
    const [selectedMetric, metricInfo] = selectedMetricInfo
    if (!selectedMetric || !metricInfo) continue
    const [category, metricType] = metricInfo.riskCategory?.split('/') || []

    const thresholdTypes: GCODefinition['riskProfile']['thresholdTypes'] = []
    if (metricInfo.lowerBaselineDeviation) {
      thresholdTypes.push('ACT_WHEN_LOWER')
    }
    if (metricInfo.higherBaselineDeviation) {
      thresholdTypes.push('ACT_WHEN_HIGHER')
    }

    gcoDSConfig.metricConfigurations.push({
      serviceIdentifier: metricInfo.service?.value as string,
      envIdentifier: metricInfo.environment?.value as string,
      metricDefinition: {
        dashboardName: metricInfo.dashboardName as string,
        dashboardPath: metricInfo.dashboardPath as string,
        metricName: metricInfo.metricName as string,
        metricTags: Object.keys(metricInfo.metricTags || {}),
        isManualQuery: metricInfo.isManualQuery,
        jsonMetricDefinition: JSON.parse(metricInfo.query || ''),
        riskProfile: {
          metricType: metricType as TimeSeriesMetricDefinition['metricType'],
          category: category as GCODefinition['riskProfile']['category'],
          thresholdTypes
        }
      }
    })
  }

  return gcoDSConfig
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
          history.push(`${routes.toCVAdminSetup(params)}?step=2`)
        }}
      />
    </Container>
  )
}
