import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Container, Icon, Text, Color, Button, TextInput } from '@wings-software/uikit'
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core'
import moment from 'moment'
import { Page } from '@common/exports'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import { useStrings, String } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetMonitoringSources, MonitoringSource, useDeleteDSConfig } from 'services/cv'
import Table from '@common/components/Table/Table'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { getRoutePathByType } from '@cv/utils/routeUtils'
import styles from './CVMonitoringSourcesPage.module.scss'

const DATE_FORMAT_STRING = 'MMM D, YYYY h:mm a'

const getRouteType = (type: string) => {
  const typeMappings: any = {
    AppDynamics: 'AppDynamics',
    APP_DYNAMICS: 'AppDynamics',
    STACKDRIVER: 'STACKDRIVER'
  }
  return getRoutePathByType(typeMappings[type])
}

export default function CVMonitoringSourcesPage() {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const { getString } = useStrings()
  const history = useHistory()
  const [page, setPage] = useState(0)
  const [textFilter, setTextFilter] = useState('')
  const { data, refetch, loading, error } = useGetMonitoringSources({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier,
      pageIndex: page,
      pageSize: 5,
      filter: textFilter
    },
    debounce: 400
  })

  const { mutate: deleteMonitoringSource } = useDeleteDSConfig({})

  const onCreateNew = () =>
    history.push(
      routes.toCVAdminSetup({
        accountId,
        projectIdentifier,
        orgIdentifier
      })
    )

  const onEdit = (identifier: string, type: string) =>
    history.push(
      routes.toCVAdminSetupMonitoringSourceEdit({
        accountId,
        projectIdentifier,
        orgIdentifier,
        monitoringSource: getRouteType(type),
        identifier
      })
    )

  const onDelete = async (identifier: string) => {
    await deleteMonitoringSource('' as any, {
      queryParams: {
        accountId,
        projectIdentifier,
        orgIdentifier,
        monitoringSourceIdentifier: identifier
      }
    })
    const { pageItemCount, pageIndex } = data?.resource!
    if (pageIndex! > 0 && pageItemCount === 1) {
      setPage(page - 1)
    } else {
      refetch()
    }
  }

  const { content, pageSize = 0, pageIndex = 0, totalPages = 0, totalItems = 0 } = data?.resource ?? ({} as any)

  return (
    <>
      <Page.Header
        title={
          <Breadcrumbs
            links={[
              {
                url: routes.toCVProjectOverview({ accountId, projectIdentifier, orgIdentifier }),
                label: projectIdentifier
              },
              {
                url: '#',
                label: getString('cv.navLinks.adminSideNavLinks.monitoringSources')
              }
            ]}
          />
        }
        toolbar={
          <TextInput
            leftIcon="search"
            placeholder={getString('cv.admin.monitoringSources.searchPlaceholder')}
            className={styles.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPage(0)
              setTextFilter(e.target.value.trim())
            }}
          />
        }
      />
      <Page.Body
        className={styles.main}
        error={error?.message}
        noData={{
          when: () => !loading && !content?.length,
          icon: 'warning-sign',
          buttonText: getString('cv.admin.monitoringSources.newMonitoringSource'),
          message: getString('cv.admin.monitoringSources.noDataMessage'),
          onClick: onCreateNew
        }}
      >
        <Button
          intent="primary"
          icon="plus"
          text={getString('cv.admin.monitoringSources.newMonitoringSource')}
          margin={{ bottom: 'small' }}
          onClick={onCreateNew}
        />
        {loading && <PageSpinner />}
        {content?.length && (
          <Table<MonitoringSource>
            columns={[
              {
                Header: getString('name'),
                accessor: 'monitoringSourceName',
                width: '25%'
              },
              {
                Header: getString('typeLabel'),
                accessor: 'type',
                width: '10%',
                Cell: TypeTableCell
              },
              {
                Header: getString('numberOfServices'),
                accessor: 'numberOfServices',
                width: '15%'
              },
              {
                Header: getString('cv.admin.monitoringSources.importStatus'),
                accessor: 'importStatus',
                width: '25%',
                Cell: ImportStatusCell
              },
              {
                Header: getString('cv.admin.monitoringSources.importedOn'),
                accessor: 'importedAt',
                width: '25%',
                Cell: function ImportedCellWrap(props) {
                  return <ImportedOnCell {...props} onEdit={onEdit} onDelete={onDelete} />
                }
              }
            ]}
            data={content}
            pagination={{
              pageSize,
              pageIndex,
              pageCount: totalPages,
              itemCount: totalItems,
              gotoPage: setPage
            }}
          />
        )}
      </Page.Body>
    </>
  )
}

function TypeTableCell(tableProps: CellProps<MonitoringSource>): JSX.Element {
  return (
    <Container>
      {tableProps.value === 'APP_DYNAMICS' && <Icon name="service-appdynamics" size={18} />}
      {tableProps.value === 'STACKDRIVER' && <Icon name="service-stackdriver" size={18} />}
    </Container>
  )
}

function ImportStatusCell(tableProps: CellProps<MonitoringSource>): JSX.Element {
  const {
    numberOfApplications,
    totalNumberOfApplications,
    numberOfEnvironments,
    totalNumberOfEnvironments
  } = tableProps.value
  return (
    <>
      <Text lineClamp={1}>
        <String
          stringID="cv.admin.monitoringSources.applicationsImported"
          vars={{ num: numberOfApplications, total: totalNumberOfApplications }}
        />
      </Text>
      <Text lineClamp={1}>
        <String
          stringID="cv.admin.monitoringSources.environmentsImported"
          vars={{ num: numberOfEnvironments, total: totalNumberOfEnvironments }}
        />
      </Text>
    </>
  )
}

function ImportedOnCell(
  props: CellProps<MonitoringSource> & {
    onEdit(id?: string, type?: string): void
    onDelete(id?: string): void
  }
): JSX.Element {
  return (
    <Container flex>
      <Text>{moment(props.value).format(DATE_FORMAT_STRING)}</Text>
      <Popover
        position={Position.BOTTOM}
        content={
          <Menu>
            <MenuItem
              icon="edit"
              text={<String stringID="edit" />}
              onClick={() => props?.onEdit(props.row.original.monitoringSourceIdentifier, props.row.original.type)}
            />
            <MenuItem
              icon="trash"
              text={<String stringID="delete" />}
              onClick={() => props?.onDelete(props.row.original.monitoringSourceIdentifier)}
            />
          </Menu>
        }
      >
        <Button minimal icon="main-more" color={Color.GREY_350} />
      </Popover>
    </Container>
  )
}
