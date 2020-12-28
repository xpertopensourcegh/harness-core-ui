import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { Container, Icon, Text, Color, Button, IconName, TextInput } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { Page } from '@common/exports'
import { useStrings, String } from 'framework/exports'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useGetVerificationJobs, useDeleteVerificationJob, VerificationJobDTO } from 'services/cv'
import Table from '@common/components/Table/Table'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import routes from '@common/RouteDefinitions'
import ContextMenuActions from '../../../components/ContextMenuActions/ContextMenuActions'
import styles from './CVVerificationJobsPage.module.scss'

export default function CVVerificationJobsPage() {
  const { getString } = useStrings()
  const history = useHistory()
  const [page, setPage] = useState(0)
  const [textFilter, setTextFilter] = useState('')
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const { data, loading, error, refetch } = useGetVerificationJobs({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier,
      offset: page,
      pageSize: 3,
      filter: textFilter
    },
    debounce: 400
  })

  const { mutate: deleteVerificationJob, loading: isDeleting } = useDeleteVerificationJob({})

  const onCreateNew = () =>
    history.push(
      routes.toCVAdminSetup({
        accountId,
        projectIdentifier,
        orgIdentifier
      }) + '?step=3'
    )

  const onDelete = async (identifier?: string) => {
    await deleteVerificationJob('' as any, { queryParams: { accountId, identifier } })
    const { pageItemCount, pageIndex } = data?.resource ?? {}
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
                label: getString('verificationJobs')
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
          buttonText: getString('cv.admin.verificationJobs.newVerificationJob'),
          message: getString('cv.admin.verificationJobs.noDataMessage'),
          onClick: onCreateNew
        }}
      >
        <Button
          intent="primary"
          icon="plus"
          text={getString('cv.admin.verificationJobs.newVerificationJob')}
          margin={{ bottom: 'small' }}
          onClick={onCreateNew}
        />
        {(loading || isDeleting) && <PageSpinner />}
        <Table<VerificationJobDTO>
          columns={[
            {
              Header: getString('name'),
              width: '15%',
              accessor: 'jobName',
              Cell: TableCell
            },
            {
              Header: getString('typeLabel'),
              width: '10%',
              accessor: 'type',
              Cell: TypeCell
            },
            {
              Header: getString('services'),
              width: '10%',
              accessor: 'serviceIdentifier',
              Cell: TableCell
            },
            {
              Header: getString('environment'),
              width: '10%',
              accessor: 'envIdentifier',
              Cell: TableCell
            },
            {
              Header: getString('activitySource'),
              width: '10%',
              accessor: 'activitySourceIdentifier',
              Cell: TableCell
            },
            {
              Header: getString('dataSource'),
              width: '10%',
              accessor: 'dataSources',
              Cell: DataSourceCell
            },
            {
              Header: getString('duration'),
              width: '10%',
              accessor: 'duration',
              Cell: TableCell
            },
            {
              Header: getString('sensitivity'),
              width: '10%',
              disableSortBy: false,
              Cell: SensitivityCell
            },
            {
              Header: getString('execution.triggerType.WEBHOOK'),
              width: '15%',
              Cell: function WebHookCellWrapper(props: CellProps<VerificationJobDTO>) {
                return <WebHookCell {...props} onDelete={() => onDelete(props.row.original.identifier)} />
              }
            }
          ]}
          data={content || []}
          pagination={{
            pageSize,
            pageIndex,
            pageCount: totalPages,
            itemCount: totalItems,
            gotoPage: setPage
          }}
        />
      </Page.Body>
    </>
  )
}

function TableCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
  return (
    <Container className={styles.tableCell}>
      <Text lineClamp={1} color={Color.BLACK}>
        {tableProps.value}
      </Text>
    </Container>
  )
}

function TypeCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
  const iconProps = {
    size: 18
  }
  switch (tableProps.value) {
    case 'TEST':
      return (
        <Text icon="canary-outline" iconProps={iconProps}>
          <String stringID="cv.admin.verificationJobs.jobTypes.test" />
        </Text>
      )
    case 'CANARY':
      return (
        <Text icon="canary" iconProps={iconProps}>
          <String stringID="cv.admin.verificationJobs.jobTypes.canary" />
        </Text>
      )
    case 'BLUE_GREEN':
      return (
        <Text icon="bluegreen" iconProps={iconProps}>
          <String stringID="cv.admin.verificationJobs.jobTypes.blueGreen" />
        </Text>
      )
    case 'HEALTH':
      return (
        <Text icon="health" iconProps={iconProps}>
          <String stringID="cv.admin.verificationJobs.jobTypes.health" />
        </Text>
      )
    default:
      return <Text />
  }
}

function DataSourceCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
  return (
    <>
      {tableProps.row.original.dataSources?.map(item => {
        let iconName: IconName
        switch (item) {
          case 'APP_DYNAMICS':
            iconName = 'service-appdynamics'
            break
          case 'SPLUNK':
            iconName = 'service-splunk'
            break
          case 'STACKDRIVER':
            iconName = 'service-stackdriver'
            break
        }
        if (iconName) {
          return <Icon name={iconName} size={18} margin={{ right: 'xsmall' }} />
        } else {
          return null
        }
      })}
    </>
  )
}

function SensitivityCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
  // TODO - swagger issue, VerificationJobDTO's missing sensitivity
  const data = tableProps.row.original as any
  return <Text>{data.sensitivity}</Text>
}

function WebHookCell(tableProps: CellProps<VerificationJobDTO> & { onDelete(): void }): JSX.Element {
  const { getString } = useStrings()
  return (
    <Container flex>
      <Button minimal icon="link" disabled />
      <ContextMenuActions
        titleText={getString('cv.admin.verificationJobs.confirmDeleteTitle')}
        contentText={getString('cv.admin.verificationJobs.confirmDeleteContent', {
          jobName: tableProps.row.original.jobName
        })}
        onDelete={tableProps.onDelete}
      />
    </Container>
  )
}
