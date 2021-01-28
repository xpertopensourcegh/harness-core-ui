import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { CellProps } from 'react-table'
import { PopoverInteractionKind, Tooltip } from '@blueprintjs/core'
import { Container, Icon, Text, Color, Button, IconName, TextInput } from '@wings-software/uicore'
import { useHistory } from 'react-router-dom'
import { Page } from '@common/exports'
import { useStrings, String } from 'framework/exports'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import {
  useGetVerificationJobs,
  useDeleteVerificationJob,
  VerificationJobDTO,
  DeleteVerificationJobQueryParams
} from 'services/cv'
import Table from '@common/components/Table/Table'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { Breadcrumbs } from '@common/components/Breadcrumbs/Breadcrumbs'
import routes from '@common/RouteDefinitions'
import { CopyText } from '@common/components/CopyText/CopyText'
import ContextMenuActions from '../../../components/ContextMenuActions/ContextMenuActions'
import styles from './CVVerificationJobsPage.module.scss'

const ENV_IDENTIFIER = '${envIdentifier}'
const SERVICE_IDENTIFIER = '${serviceIdentifier}'

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
      pageSize: 10,
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

  const onEdit = (verificationId: string) =>
    history.push(
      routes.toCVAdminSetupVerificationJobEdit({
        accountId,
        projectIdentifier,
        orgIdentifier,
        verificationId
      })
    )

  const onDelete = async (identifier?: string) => {
    await deleteVerificationJob('' as any, {
      queryParams: { accountId, identifier, projectIdentifier, orgIdentifier } as DeleteVerificationJobQueryParams
    })
    const { pageItemCount, pageIndex } = (data?.resource ?? {}) as any // TODO - swagger issue, remove when fixed
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
          onRowClick={val => {
            if (!val.defaultJob) onEdit(val.identifier!)
          }}
          columns={[
            {
              Header: getString('name'),
              width: '15%',
              accessor: 'jobName',
              Cell: TableCell
            },
            {
              Header: getString('typeLabel'),
              width: '5%',
              accessor: 'type',
              Cell: TypeCell
            },
            {
              Header: getString('services'),
              width: '12%',
              accessor: 'serviceIdentifier',
              Cell: TableCell
            },
            {
              Header: getString('environment'),
              width: '12%',
              accessor: 'envIdentifier',
              Cell: TableCell
            },
            {
              Header: getString('changeSource'),
              width: '12%',
              accessor: 'activitySourceIdentifier',
              Cell: ChangeSourceCell
            },
            {
              Header: getString('monitoringSource'),
              width: '12%',
              accessor: 'dataSources',
              Cell: DataSourceCell
            },
            {
              Header: getString('duration'),
              width: '10%',
              accessor: 'duration',
              Cell: TableCell
            },
            // {
            //   Header: getString('sensitivity'),
            //   width: '10%',
            //   disableSortBy: false,
            //   Cell: SensitivityCell
            // },
            {
              Header: getString('execution.triggerType.WEBHOOK'),
              width: '22%',
              Cell: function WebHookCellWrapper(props: CellProps<VerificationJobDTO>) {
                return props.row.original?.defaultJob ? (
                  <Text color={Color.BLACK}>{getString('na')}</Text>
                ) : (
                  <WebHookCell
                    {...props}
                    onDelete={() => onDelete(props.row.original?.identifier)}
                    onEdit={() => onEdit(props.row.original?.identifier!)}
                  />
                )
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
  const { getString } = useStrings()
  return (
    <Container className={styles.tableCell}>
      <Text lineClamp={1} color={Color.BLACK}>
        {tableProps.value === SERVICE_IDENTIFIER || tableProps.value === ENV_IDENTIFIER
          ? getString('all')
          : tableProps.value}
      </Text>
    </Container>
  )
}

function ChangeSourceCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
  const { getString } = useStrings()
  return (
    <Container className={styles.tableCell}>
      <Text lineClamp={1} color={Color.BLACK}>
        {tableProps.row.original?.defaultJob ? getString('all') : tableProps.value}
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
        <Tooltip
          interactionKind={PopoverInteractionKind.HOVER}
          content={<String stringID="cv.admin.verificationJobs.jobTypes.test" />}
        >
          <Icon name="lab-test" {...iconProps} />
        </Tooltip>
      )
    case 'CANARY':
      return (
        <Tooltip
          interactionKind={PopoverInteractionKind.HOVER}
          content={<String stringID="cv.admin.verificationJobs.jobTypes.canary" />}
        >
          <Icon name="canary-outline" {...iconProps} />
        </Tooltip>
      )
    case 'BLUE_GREEN':
      return (
        <Tooltip
          interactionKind={PopoverInteractionKind.HOVER}
          content={<String stringID="cv.admin.verificationJobs.jobTypes.blueGreen" />}
        >
          <Icon name="bluegreen" {...iconProps} />
        </Tooltip>
      )
    case 'HEALTH':
      return (
        <Tooltip
          interactionKind={PopoverInteractionKind.HOVER}
          content={<String stringID="cv.admin.verificationJobs.jobTypes.health" />}
        >
          <Icon name="health" {...iconProps} />
        </Tooltip>
      )
    default:
      return <Text />
  }
}

function DataSourceCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
  const { serviceIdentifier, envIdentifier } = tableProps.row.original || {}
  const { getString } = useStrings()
  return envIdentifier === ENV_IDENTIFIER && serviceIdentifier === SERVICE_IDENTIFIER ? (
    <Text color={Color.BLACK}>{getString('all')}</Text>
  ) : (
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

// function SensitivityCell(tableProps: CellProps<VerificationJobDTO>): JSX.Element {
//   // TODO - swagger issue, VerificationJobDTO's missing sensitivity
//   const { getString } = useStrings()
//   const data = tableProps.row.original as any
//   return (
//     <Text color={Color.BLACK}>{tableProps.row.original.type === 'HEALTH' ? getString('na') : data.sensitivity}</Text>
//   )
// }

function WebHookCell(tableProps: CellProps<VerificationJobDTO> & { onDelete(): void; onEdit(): void }): JSX.Element {
  const { getString } = useStrings()
  return (
    <Container flex>
      <Container width={180} onClick={e => e.stopPropagation()}>
        <CopyText textToCopy={tableProps.row.original.verificationJobUrl!}>
          {tableProps.row.original.verificationJobUrl}
        </CopyText>
      </Container>
      {!tableProps.row.original?.defaultJob ? (
        <ContextMenuActions
          titleText={getString('cv.admin.verificationJobs.confirmDeleteTitle')}
          contentText={
            getString('cv.admin.verificationJobs.confirmDeleteContent', {
              jobName: tableProps.row.original.jobName
            }) + '?'
          }
          onDelete={tableProps.onDelete}
          onEdit={tableProps.onEdit}
        />
      ) : null}
    </Container>
  )
}
