import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import type { CellProps } from 'react-table'
import moment from 'moment'
import { Classes, Menu, MenuItem, Popover } from '@blueprintjs/core'
import { Color, Container, Text, TextInput, Icon, Button } from '@wings-software/uikit'
import { KubernetesActivitySourceDTO, useDeleteKubernetesSource, useListKubernetesSources } from 'services/cv'
import { Page, useConfirmationDialog, useToaster } from '@common/exports'
import { Table } from '@common/components'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useStrings, useAppStore } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import css from './CVActivitySourcesPage.module.scss'

type TableData = {
  numberOfEnvironments?: number
  numberOfServices?: number
  name: string
  type: 'KUBERNETES'
  createdOn?: string
  lastUpdatedOn?: string
  identifier: string
}

const DATE_FORMAT_STRING = 'MMM D, YYYY h:mm a'

function generateTableData(activitySources?: KubernetesActivitySourceDTO[]): TableData[] {
  if (!activitySources?.length) {
    return []
  }

  const tableData: TableData[] = []
  for (const activitySource of activitySources) {
    if (!activitySources || !activitySource.name) continue
    const environments = new Set<string>()
    const services = new Set<string>()
    activitySource.activitySourceConfigs?.forEach(config => {
      services.add(config.serviceIdentifier)
      environments.add(config.envIdentifier)
    })
    tableData.push({
      numberOfEnvironments: environments.size,
      numberOfServices: services.size,
      name: activitySource.name,
      identifier: activitySource.identifier || '',
      type: 'KUBERNETES',
      createdOn: moment(activitySource.createdAt).format(DATE_FORMAT_STRING),
      lastUpdatedOn: moment(activitySource.lastUpdatedAt).format(DATE_FORMAT_STRING)
    })
  }

  return tableData
}

function TableCell(tableProps: CellProps<TableData>): JSX.Element {
  return (
    <Text lineClamp={1} color={Color.BLACK}>
      {tableProps.value}
    </Text>
  )
}

function TypeTableCell(tableProps: CellProps<TableData>): JSX.Element {
  return <Container>{tableProps.value === 'KUBERNETES' && <Icon name="service-kubernetes" size={18} />}</Container>
}

function LastUpdatedOnWithMenu(tableProps: CellProps<TableData>): JSX.Element {
  const params = useParams<ProjectPathProps & AccountPathProps>()
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const { getString } = useStrings()
  const { showError } = useToaster()
  const { mutate } = useDeleteKubernetesSource({
    queryParams: {
      accountId: params.accountId,
      projectIdentifier: params.projectIdentifier,
      orgIdentifier: params.orgIdentifier
    }
  })
  const { openDialog } = useConfirmationDialog({
    contentText: `${getString('cv.admin.activitySources.dialogDeleteContent')}${tableProps.row.original?.name} ?`,
    titleText: getString('cv.admin.activitySources.dialogDeleteTitle'),
    confirmButtonText: getString('delete'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: function (shouldDeleteActivitySource: boolean) {
      setIsPopoverOpen(false)
      if (shouldDeleteActivitySource) {
        mutate(tableProps.row.original?.identifier)
          .then(() => {
            tableProps.onDelete()
          })
          .catch(error => {
            showError(error?.message, 3500)
          })
      }
    }
  })
  return (
    <Container flex>
      <Text color={Color.BLACK}>{tableProps.value}</Text>
      <Popover
        isOpen={isPopoverOpen}
        onInteraction={nextOpenState => {
          setIsPopoverOpen(nextOpenState)
        }}
        className={Classes.DARK}
        content={
          <Menu>
            <MenuItem
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                openDialog()
              }}
              text={getString('delete')}
              icon="trash"
            />
          </Menu>
        }
      >
        <Icon
          name="main-more"
          className={css.more}
          onClick={e => {
            e.stopPropagation()
            setIsPopoverOpen(isOpen => !isOpen)
          }}
        />
      </Popover>
    </Container>
  )
}

export default function CVActivitySourcesPage(): JSX.Element {
  const { getString } = useStrings()
  const params = useParams<ProjectPathProps & AccountPathProps>()
  const history = useHistory()
  const { projects } = useAppStore()
  const project = projects.find(({ identifier }) => identifier === params.projectIdentifier)
  const [{ pageOffset, filter, debounce }, setFilterAndPageOffset] = useState<{
    pageOffset: number
    debounce: number
    filter?: string
  }>({
    pageOffset: 0,
    debounce: 0,
    filter: undefined
  })
  const { data, loading, error, refetch: refetchSources } = useListKubernetesSources({
    debounce,
    queryParams: {
      accountId: params.accountId,
      projectIdentifier: params.projectIdentifier,
      orgIdentifier: params.orgIdentifier,
      offset: pageOffset,
      pageSize: 10,
      filter
    }
  })

  const { content: activitySources, pageIndex = -1, totalItems = 0, totalPages = 0, pageSize = 0 } =
    data?.resource || {}
  const tableData = generateTableData(activitySources)
  return (
    <>
      <Page.Header
        title={
          <Breadcrumbs
            links={[
              {
                url: routes.toCVMainDashBoardPage({
                  orgIdentifier: params.orgIdentifier,
                  projectIdentifier: params.projectIdentifier,
                  accountId: params.accountId
                }),
                label: project?.name as string
              },
              { url: '#', label: getString('cv.navLinks.adminSideNavLinks.activitySources') }
            ]}
          />
        }
        toolbar={
          <TextInput
            leftIcon="search"
            placeholder={getString('cv.admin.activitySources.searchBoxPlaceholder')}
            className={css.search}
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFilterAndPageOffset({ filter: e.target.value.trim(), pageOffset, debounce: 400 })
            }}
          />
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={() => refetchSources()}
        noData={{
          when: () => activitySources?.length === 0,
          icon: 'warning-sign',
          buttonText: getString('cv.admin.activitySources.addActivitySource'),
          message: getString('cv.admin.activitySources.noDataMessage'),
          onClick: () => history.push(routes.toCVAdminSetup({ ...params }))
        }}
      >
        <Container className={css.main}>
          <Button
            text={getString('cv.admin.activitySources.addActivitySource')}
            intent="primary"
            onClick={() => history.push(routes.toCVAdminSetup({ ...params }))}
          />
          <Table<TableData>
            data={tableData}
            onRowClick={(rowData: TableData) =>
              history.push(
                routes.toCVActivitySourceEditSetup({
                  projectIdentifier: params.projectIdentifier,
                  orgIdentifier: params.orgIdentifier,
                  activitySource: 'kubernetes',
                  activitySourceId: rowData.identifier,
                  accountId: params.accountId
                })
              )
            }
            pagination={{
              pageSize: pageSize || 0,
              pageIndex: pageIndex,
              pageCount: totalPages,
              itemCount: totalItems,
              gotoPage: newPageIndex => setFilterAndPageOffset({ pageOffset: newPageIndex, filter, debounce: 0 })
            }}
            columns={[
              {
                accessor: 'name',
                Header: getString('pipelineSteps.build.stageSpecifications.variableNamePlaceholder'),
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'type',
                Header: getString('typeLabel'),
                width: '16.5%',
                Cell: TypeTableCell,
                disableSortBy: true
              },
              {
                accessor: 'numberOfEnvironments',
                Header: getString('cv.admin.activitySources.tableColumnNames.services'),
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'numberOfServices',
                Header: getString('cv.admin.activitySources.tableColumnNames.environments'),
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'createdOn',
                Header: getString('cv.admin.activitySources.tableColumnNames.createdOn'),
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'lastUpdatedOn',
                Header: getString('cv.admin.activitySources.tableColumnNames.lastUpdatedOn'),
                width: '16.5%',
                Cell: function LastColumn(cellProps: CellProps<TableData>) {
                  return <LastUpdatedOnWithMenu {...cellProps} onDelete={refetchSources} />
                }
              }
            ]}
          />
        </Container>
      </Page.Body>
    </>
  )
}
