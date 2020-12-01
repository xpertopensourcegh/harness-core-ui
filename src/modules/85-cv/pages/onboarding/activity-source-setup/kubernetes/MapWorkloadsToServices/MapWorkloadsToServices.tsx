import React, { useEffect, useState } from 'react'
import { Color, Container, Heading, Select, SelectOption, Text } from '@wings-software/uikit'
import type { CellProps } from 'react-table'
import { useParams } from 'react-router-dom'
import { Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { useGetWorkloads } from 'services/cv'
import { PageError } from '@common/components/Page/PageError'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { TableColumnWithFilter } from '@cv/components/TableColumnWithFilter/TableColumnWithFilter'
import EnvironmentSelect from '@cv/pages/monitoring-source/app-dynamics/SelectApplications/EnvironmentSelect'
import {
  EnvironmentResponseDTO,
  ServiceResponseDTO,
  useGetEnvironmentListForProject,
  useGetServiceListForProject
} from 'services/cd-ng'
import { Table } from '@common/components'
import { NavItem } from '@cv/pages/onboarding/SetupPageLeftNav/NavItem/NavItem'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { useStrings } from 'framework/exports'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { SelectKubernetesNamespaceFieldNames } from '../SelectKubernetesNamespaces/SelectKubernetesNamespaces'
import css from './MapWorkloadsToServices.module.scss'

export interface MapWorkloadsToServicesProps {
  data?: any
  onSubmit: (data: any) => void
  onPrevious: () => void
}

interface WorkloadsToServicesTableProps {
  selectedWorkloads: Map<string, TableData>
  selectedNamespace: string
  connectorIdentifier: string
  onClickWorkload: (selectedWorkload: TableData) => void
}

type TableData = {
  serviceIdentifier?: SelectOption
  environmentIdentifier?: SelectOption
  workload: string
  selected: boolean
}

const TOTAL_ITEMS_PER_PAGE = 7

function generateOptions(response?: EnvironmentResponseDTO[] | ServiceResponseDTO[]): SelectOption[] {
  return response
    ? (response
        .filter(entity => entity && entity.identifier && entity.name)
        .map(entity => ({ value: entity.identifier, label: entity.name })) as SelectOption[])
    : []
}

function updateTableRow(tableData: TableData[], fieldName: string, value: any, rowIndex: number): TableData[] {
  const updatedTableData = [...tableData]
  updatedTableData[rowIndex] = {
    ...tableData[rowIndex],
    [fieldName]: value
  }
  return updatedTableData
}

function removeWorkloadsWithoutAllColumnsSelected(
  selectedWorkloads: Map<string, Map<string, TableData>>
): Map<string, Map<string, TableData>> {
  for (const namespace of selectedWorkloads) {
    const [, tableData] = namespace
    for (const tableRow of tableData) {
      const [workload, rowData] = tableRow
      if (!rowData.selected || !rowData.serviceIdentifier || !rowData.environmentIdentifier) {
        tableData.delete(workload)
      }
    }
  }

  return selectedWorkloads
}

function generateUpdatedServiceOptions(
  serviceOptions: SelectOption[],
  selectedService: SelectOption,
  currentService: SelectOption
): SelectOption[] {
  const updatedServiceOptions = [...serviceOptions]
  if (currentService?.value) updatedServiceOptions.push(currentService)
  updatedServiceOptions.splice(
    updatedServiceOptions.findIndex(service => service.value === selectedService.value),
    1
  )
  updatedServiceOptions.sort((a, b) => (a.label as any) - (b.label as any))
  return updatedServiceOptions
}

function removeSelectedOptions(selectedWorkloads: Map<string, TableData>, generatedOptions: SelectOption[]): void {
  for (const selectedWorkload of selectedWorkloads) {
    const [, tableRow] = selectedWorkload
    const selectedServiceIndex = generatedOptions.findIndex(
      option => option.value === tableRow.serviceIdentifier?.value
    )
    if (selectedServiceIndex > -1) {
      generatedOptions.splice(selectedServiceIndex, 1)
    }
  }
}

function initializeTableData(selectedWorkloads: Map<string, TableData>, workloads?: string[]): TableData[] {
  if (!workloads?.length) {
    return []
  }
  const tableData: TableData[] = []
  for (const workload of workloads) {
    const existingWorkload = selectedWorkloads.get(workload)
    if (existingWorkload) {
      tableData.push(existingWorkload)
    } else {
      tableData.push({ selected: false, workload })
    }
  }

  return tableData
}

function WorkloadsToServicesTable(props: WorkloadsToServicesTableProps): JSX.Element {
  const { onClickWorkload, selectedNamespace, selectedWorkloads, connectorIdentifier } = props
  const { getString } = useStrings()
  const queryParams = useParams<ProjectPathProps & AccountPathProps>()
  const { data: sOptions } = useGetServiceListForProject({ queryParams })
  const [tableData, setTableData] = useState<TableData[]>([])
  const [{ pageOffset, filteredWorkload }, setFilterAndPageOffset] = useState<{
    pageOffset: number
    filteredWorkload?: string
  }>({
    pageOffset: 0,
    filteredWorkload: undefined
  })

  const { data: workloads, error, loading, refetch: refetchWorkloads } = useGetWorkloads({
    queryParams: {
      ...queryParams,
      offset: pageOffset,
      connectorIdentifier,
      namespace: selectedNamespace,
      pageSize: TOTAL_ITEMS_PER_PAGE,
      filter: filteredWorkload,
      orgIdentifier: queryParams.orgIdentifier as string,
      projectIdentifier: queryParams.projectIdentifier as string
    }
  })
  const { data: envOptions } = useGetEnvironmentListForProject({ queryParams })
  const [serviceOptions, setServiceOptions] = useState<SelectOption[]>([{ label: '', value: getString('loading') }])
  const [environmentOptions, setEnvironmentOptions] = useState<SelectOption[]>([
    { label: '', value: getString('loading') }
  ])

  useEffect(() => {
    if (loading) {
      const loadingItems = Array<TableData>(TOTAL_ITEMS_PER_PAGE).fill(
        { selected: false, workload: getString('loading') },
        0,
        TOTAL_ITEMS_PER_PAGE
      )
      setTableData(loadingItems)
    } else {
      setTableData(initializeTableData(selectedWorkloads, workloads?.resource?.content))
    }
  }, [workloads, selectedWorkloads, loading])

  useEffect(() => {
    setEnvironmentOptions(generateOptions(envOptions?.data?.content))
  }, [envOptions])

  useEffect(() => {
    const generatedOptions = generateOptions(sOptions?.data?.content)
    removeSelectedOptions(selectedWorkloads, generatedOptions)
    setServiceOptions(generatedOptions)
  }, [sOptions, selectedNamespace])

  const { pageSize, pageIndex, totalItems, totalPages } = workloads?.resource || {}

  if (error?.message) {
    return <PageError message={error.message} onClick={() => refetchWorkloads()} />
  }

  if (!workloads?.resource?.content?.length && !loading) {
    return (
      <NoDataCard
        message={getString('cv.activitySources.kubernetes.noWorkloads')}
        icon="warning-sign"
        buttonText={getString('retry')}
        onClick={() => refetchWorkloads()}
        className={css.noWorkloads}
      />
    )
  }

  return (
    <Table<TableData>
      className={css.workloadTable}
      data={tableData}
      pagination={{
        pageSize: pageSize || 0,
        pageIndex: pageIndex,
        pageCount: totalPages || 0,
        itemCount: totalItems || 0,
        gotoPage: newPageIndex => setFilterAndPageOffset({ pageOffset: newPageIndex, filteredWorkload })
      }}
      columns={[
        {
          accessor: 'selected',
          width: '5%',
          disableSortBy: true,
          Cell: function CheckColumn(tableProps: CellProps<TableData>) {
            return loading ? (
              <Container height={16} width={16} className={Classes.SKELETON} />
            ) : (
              <input
                type="checkbox"
                checked={tableProps.value}
                onChange={() => {
                  onClickWorkload({ ...tableProps.row.original, selected: !tableProps.value })
                  setTableData(updateTableRow(tableData, 'selected', !tableProps.value, tableProps.row.index))
                }}
              />
            )
          }
        },
        {
          Header: getString('cv.activitySources.kubernetes.workloadToServiceTableColumns.workload'),
          accessor: 'workload',
          width: '20%',
          disableSortBy: true,
          Cell: function Workload(tableProps: CellProps<TableData>) {
            return (
              <Text
                color={Color.BLACK}
                className={loading ? Classes.SKELETON : undefined}
                onClick={() => {
                  onClickWorkload({ ...tableProps.row.original, selected: !tableProps.row.original.selected })
                  setTableData(
                    updateTableRow(tableData, 'selected', !tableProps.row.original.selected, tableProps.row.index)
                  )
                }}
              >
                {tableProps.value}
              </Text>
            )
          }
        },
        {
          Header: getString('cv.activitySources.kubernetes.workloadToServiceTableColumns.mapToService'),
          accessor: 'serviceIdentifier',
          width: '30%',
          disableSortBy: true,
          Cell: function ServiceIdentifier(tableProps: CellProps<TableData>) {
            return (
              <Select
                value={tableProps.value}
                className={cx(css.selectWidth, loading ? Classes.SKELETON : undefined)}
                items={serviceOptions || []}
                onChange={selectedService => {
                  setServiceOptions(generateUpdatedServiceOptions(serviceOptions, selectedService, tableProps.value))
                  onClickWorkload({ ...tableProps.row.original, serviceIdentifier: selectedService })
                  setTableData(updateTableRow(tableData, 'serviceIdentifier', selectedService, tableProps.row.index))
                }}
              />
            )
          }
        },
        {
          Header: (
            <TableColumnWithFilter
              onFilter={namespaceSubstring =>
                setFilterAndPageOffset({ pageOffset: 0, filteredWorkload: namespaceSubstring })
              }
              columnName={getString('cv.activitySources.kubernetes.workloadToServiceTableColumns.mapToEnvironment')}
            />
          ),
          accessor: 'environmentIdentifier',
          width: '35%',
          disableSortBy: true,
          Cell: function EnvironmentIdentifier(tableProps: CellProps<TableData>) {
            return (
              <EnvironmentSelect
                options={environmentOptions || []}
                className={cx(css.selectWidth, loading ? Classes.SKELETON : undefined)}
                item={tableProps.value}
                onSelect={selectedEnv => {
                  onClickWorkload({ ...tableProps.row.original, environmentIdentifier: selectedEnv })
                  setTableData(updateTableRow(tableData, 'environmentIdentifier', selectedEnv, tableProps.row.index))
                }}
                onNewCreated={createdEnv => {
                  if (!createdEnv || !createdEnv.name || !createdEnv.identifier) {
                    return
                  }
                  const envOption = { label: createdEnv.name, value: createdEnv.identifier }
                  setEnvironmentOptions(
                    generateUpdatedServiceOptions(environmentOptions, { label: '', value: -1 }, envOption)
                  )
                  onClickWorkload({ ...tableProps.row.original, environmentIdentifier: envOption })
                  setTableData(updateTableRow(tableData, 'environmentIdentifier', envOption, tableProps.row.index))
                }}
              />
            )
          }
        }
      ]}
    />
  )
}

export function MapWorkloadsToServices(props: MapWorkloadsToServicesProps): JSX.Element {
  const { data, onSubmit, onPrevious } = props
  const [selectedWorkloads, setSelectedWorkloads] = useState(
    new Map<string, Map<string, TableData>>(
      data.selectedWorkloads ||
        data.selectedNamespaces?.map((selectedNamespace: string) => [selectedNamespace, new Map()])
    )
  )
  const [selectedNamespace, setSelectedNamespace] = useState<string>(data.selectedNamespaces[0])

  const { getString } = useStrings('cv')
  return (
    <Container className={css.main}>
      <Container className={css.namespaceNav}>
        {data[SelectKubernetesNamespaceFieldNames.SELECTED_NAME_SPACES]?.map((namespace: string) => {
          return (
            <NavItem
              label={namespace}
              leftLogo={{ name: 'service-kubernetes' }}
              key={namespace}
              isSelected={selectedNamespace === namespace}
              className={css.namespace}
              onClick={setSelectedNamespace}
            />
          )
        })}
      </Container>
      <Container className={css.workloadMapping}>
        <Heading level={2} className={css.mapWorkloadHeading}>
          {getString('cv.activitySources.kubernetes.mapWorkloadsToServices')}
        </Heading>
        <WorkloadsToServicesTable
          connectorIdentifier={data.connectorRef.value}
          selectedWorkloads={selectedWorkloads.get(selectedNamespace) as Map<string, TableData>}
          selectedNamespace={selectedNamespace}
          onClickWorkload={workloadInfo => {
            const workloads = selectedWorkloads.get(selectedNamespace || '')
            if (workloads) {
              if (workloads.has(workloadInfo.workload) && !workloadInfo.selected)
                workloads.delete(workloadInfo.workload)
              else workloads.set(workloadInfo.workload, workloadInfo)
              setSelectedWorkloads(new Map(selectedWorkloads))
            }
          }}
        />
      </Container>
      <SubmitAndPreviousButtons
        onPreviousClick={onPrevious}
        onNextClick={() =>
          onSubmit({ ...data, selectedWorkloads: removeWorkloadsWithoutAllColumnsSelected(selectedWorkloads) })
        }
      />
    </Container>
  )
}
