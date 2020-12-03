import React, { useEffect } from 'react'
import { Color, Container, Heading, Text } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Table, useToaster } from '@common/components'
import routes from '@common/RouteDefinitions'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { String, useStrings } from 'framework/exports'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { KubernetesActivitySourceDTO, useRegisterKubernetesSource } from 'services/cv'
import type { KubernetesActivitySourceInfo } from '../KubernetesActivitySourceUtils'
import css from './ReviewKubernetesActivitySource.module.scss'

interface ReviewKubernetesActivitySourceProps {
  onSubmit: (data: KubernetesActivitySourceInfo) => void
  onPrevious: () => void
  data: KubernetesActivitySourceInfo
}

type TableData = {
  namespace: string
  workload: string
  service: string
  environment: string
}

function transformIncomingData(data: any): TableData[] {
  const tableData: TableData[] = []
  if (!data?.selectedWorkloads?.size) {
    return tableData
  }
  for (const namespaceWithWorkload of data.selectedWorkloads) {
    const [namespace, selectedWorkloads] = namespaceWithWorkload
    for (const selectedWorkload of selectedWorkloads) {
      const [workload, workloadInfo] = selectedWorkload
      tableData.push({
        namespace,
        workload,
        environment: workloadInfo.environmentIdentifier?.label,
        service: workloadInfo.serviceIdentifier?.label
      })
    }
  }

  return tableData
}

function transformToSavePayload(
  data: KubernetesActivitySourceInfo,
  tableData: TableData[]
): KubernetesActivitySourceDTO {
  const activitySourceDTO: KubernetesActivitySourceDTO = {
    uuid: data.uuid,
    identifier: data.identifier,
    name: data.name,
    connectorIdentifier: data.connectorRef?.value as string,
    activitySourceConfigs: []
  }

  for (const activitySourceConfig of tableData) {
    activitySourceDTO.activitySourceConfigs.push({
      serviceIdentifier: activitySourceConfig.service,
      envIdentifier: activitySourceConfig.environment,
      namespace: activitySourceConfig.namespace,
      workloadName: activitySourceConfig.workload
    })
  }

  return activitySourceDTO
}

function TableColumn(props: CellProps<TableData>): JSX.Element {
  return <Text color={Color.BLACK}>{props.value}</Text>
}

export function ReviewKubernetesActivitySource(props: ReviewKubernetesActivitySourceProps): JSX.Element {
  const { onPrevious, data } = props
  const params = useParams<ProjectPathProps & AccountPathProps>()
  const history = useHistory()
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { mutate, error } = useRegisterKubernetesSource({
    queryParams: {
      ...params
    }
  })
  const tableData = transformIncomingData(data)
  useEffect(() => {
    if (error?.message) showError(error.message, 5000)
  }, [error?.message])

  return (
    <Container className={css.main}>
      <Heading level={2} className={css.heading}>
        <String stringID="cv.activitySources.kubernetes.reviewPage.heading" />
      </Heading>
      <Table<TableData>
        data={tableData}
        className={css.reviewTable}
        columns={[
          {
            Header: getString('cv.activitySources.kubernetes.reviewPage.reviewTableColumns.namespace'),
            accessor: 'namespace',
            width: '25%',
            Cell: TableColumn
          },
          {
            Header: getString('cv.activitySources.kubernetes.reviewPage.reviewTableColumns.workload'),
            accessor: 'workload',
            width: '25%',
            Cell: TableColumn
          },
          {
            Header: getString('cv.activitySources.kubernetes.reviewPage.reviewTableColumns.service'),
            accessor: 'service',
            width: '25%',
            Cell: TableColumn
          },
          {
            Header: getString('cv.monitoringSources.appD.harnessEnv'),
            accessor: 'environment',
            width: '25%',
            Cell: TableColumn
          }
        ]}
      />
      <SubmitAndPreviousButtons
        onPreviousClick={onPrevious}
        onNextClick={async () => {
          await mutate(transformToSavePayload(data, tableData))
          history.push(routes.toCVAdminSetup(params))
        }}
      />
    </Container>
  )
}
