import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Color, Container, Icon, Text, TextInput } from '@wings-software/uikit'
import { KubernetesActivitySourceDTO, useListKubernetesSources } from 'services/cv'
import { Page } from '@common/exports'
import { Table } from '@common/components'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useAppStoreReader, useRouteParams, useStrings } from 'framework/exports'
import { routeActivitySourceEditSetup, routeCVAdminSetup, routeCVMainDashBoardPage } from 'navigation/cv/routes'
import css from './CVActivitySourcesPage.module.scss'

type TableData = {
  numberOfEnvironments?: number
  numberOfServices?: number
  name: string
  type: 'KUBERNETES'
  createdOn?: string
  uuid: string
}

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
      uuid: activitySource.uuid || '',
      type: 'KUBERNETES'
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

export default function CVActivitySourcesPage(): JSX.Element {
  const { getString } = useStrings()
  const { params } = useRouteParams()
  const history = useHistory()
  const { projects } = useAppStoreReader()
  const project = projects.find(({ identifier }) => identifier === params.projectIdentifier)

  const [filter, setFilter] = useState<string | undefined>()
  const { data, loading, error, refetch: refetchSources } = useListKubernetesSources({
    queryParams: {
      accountId: params.accountId,
      projectIdentifier: params.projectIdentifier as string,
      orgIdentifier: params.orgIdentifier as string
    }
  })

  const activitySources = data?.resource
  const tableData = generateTableData(activitySources)
  return (
    <>
      <Page.Header
        title={
          <Breadcrumbs
            links={[
              {
                url: routeCVMainDashBoardPage.url({
                  orgIdentifier: params.orgIdentifier as string,
                  projectIdentifier: params.projectIdentifier as string
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value.trim())}
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
          onClick: () =>
            history.push(
              routeCVAdminSetup.url({
                projectIdentifier: params.projectIdentifer as string,
                orgIdentifier: params.orgIdentifier as string
              })
            )
        }}
      >
        <Container className={css.main}>
          <Table<TableData>
            data={tableData}
            onRowClick={(rowData: TableData) =>
              history.push(
                routeActivitySourceEditSetup.url({
                  projectIdentifier: params.projectIdentifier as string,
                  orgIdentifier: params.orgIdentifier as string,
                  activitySource: rowData.type,
                  activitySourceId: rowData.uuid
                })
              )
            }
            columns={[
              {
                accessor: 'name',
                Header: getString('pipelineSteps.build.stageSpecifications.variableNamePlaceholder'),
                width: '20%',
                Cell: TableCell
              },
              {
                accessor: 'type',
                Header: getString('typeLabel'),
                width: '20%',
                Cell: TypeTableCell,
                disableSortBy: true
              },
              {
                accessor: 'numberOfEnvironments',
                Header: getString('cv.admin.activitySources.tableColumnNames.services'),
                width: '20%',
                Cell: TableCell
              },
              {
                accessor: 'numberOfServices',
                Header: getString('cv.admin.activitySources.tableColumnNames.environments'),
                width: '20%',
                Cell: TableCell
              },
              {
                accessor: 'createdOn',
                Header: getString('cv.admin.activitySources.tableColumnNames.createdOn'),
                width: '20%'
              }
            ]}
          />
        </Container>
      </Page.Body>
    </>
  )
}
