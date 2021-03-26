import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import ReactTimeago from 'react-timeago'
import { Intent } from '@blueprintjs/core'
import { useHistory } from 'react-router-dom'
import {
  Avatar,
  Color,
  Container,
  FlexExpander,
  Layout,
  Pagination,
  Select,
  SelectOption,
  Text
} from '@wings-software/uicore'
import type { Cell, Column } from 'react-table'
import { ListingPageTemplate, ListingPageTitle } from '@cf/components/ListingPageTemplate/ListingPageTemplate'
import { useEnvironments } from '@cf/hooks/environment'
import Table from '@common/components/Table/Table'
import {
  CF_DEFAULT_PAGE_SIZE,
  CF_LOCAL_STORAGE_ENV_KEY,
  DEFAULT_ENV,
  DISABLE_AVATAR_PROPS,
  getErrorMessage,
  NO_ENVIRONMENT_IDENTIFIER
} from '@cf/utils/CFUtils'
import { useConfirmAction, useLocalStorage } from '@common/hooks'
import { useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/exports'
import { OptionsMenuButton } from '@common/components'
import type { GetEnvironmentListForProjectQueryParams } from 'services/cd-ng'
import { Target, useDeleteTarget, useGetAllTargets } from 'services/cf'
import { NoTargetsView } from './views/NoTargetsView'
import { NewTargets } from './NewTarget'

interface EnvironmentSelectProps {
  label: string
  environment?: SelectOption
  environments: SelectOption[]
  onChange: (opt: SelectOption) => void
}

const EnvironmentSelect: React.FC<EnvironmentSelectProps> = ({ label, environment, environments, onChange }) => (
  <Layout.Horizontal flex={{ align: 'center-center' }}>
    <Text margin={{ right: 'small' }} font={{ weight: 'bold' }}>
      {label}
    </Text>
    <Select value={environment} items={environments} onChange={onChange} />
  </Layout.Horizontal>
)

export const TargetsPage: React.FC = () => {
  const { projectIdentifier, orgIdentifier, accountId } = useParams<any>()
  const {
    data: environments,
    loading: loadingEnvironments,
    error: errEnvironments,
    refetch: refetchEnvs
  } = useEnvironments({
    projectIdentifier,
    accountIdentifier: accountId,
    orgIdentifier
  } as GetEnvironmentListForProjectQueryParams)
  const { getString } = useStrings()
  const [environment, setEnvironment] = useLocalStorage(CF_LOCAL_STORAGE_ENV_KEY, DEFAULT_ENV)
  const [pageNumber, setPageNumber] = useState(0)
  const queryParams = useMemo(
    () => ({
      project: projectIdentifier,
      environment: (environment?.value || '') as string,
      pageNumber,
      pageSize: CF_DEFAULT_PAGE_SIZE,
      account: accountId,
      org: orgIdentifier
    }),
    [environment?.value, pageNumber]
  )
  const { data: targetsData, loading: loadingTargets, error: errTargets, refetch: refetchTargets } = useGetAllTargets({
    queryParams
  })
  const history = useHistory()
  const loading = loadingEnvironments || loadingTargets
  const error = errEnvironments || errTargets
  const noTargetExists = targetsData?.targets?.length === 0
  const title = getString('cf.targets.title')
  const header = (
    <Layout.Horizontal flex={{ align: 'center-center' }} style={{ flexGrow: 1 }} padding={{ right: 'xlarge' }}>
      <ListingPageTitle style={{ borderBottom: 'none' }}>{title}</ListingPageTitle>
      <FlexExpander />
      {!!environments?.length && (
        <EnvironmentSelect
          label={getString('cf.shared.environment').toLocaleUpperCase()}
          environment={environment?.value ? environment : environments[0]}
          environments={environments}
          onChange={({ label, value }) => setEnvironment({ label, value: value as string })}
        />
      )}
    </Layout.Horizontal>
  )
  const toolbar = (
    <Layout.Horizontal>
      <NewTargets
        accountId={accountId}
        orgIdentifier={orgIdentifier}
        projectIdentifier={projectIdentifier}
        environmentIdentifier={environment?.value}
        onCreated={() => {
          setPageNumber(0)
          refetchTargets({ queryParams: { ...queryParams, pageNumber: 0 } })
        }}
      />
    </Layout.Horizontal>
  )
  const gotoTargeDetailPage = (identifier: string) => {
    history.push(
      routes.toCFTargetDetails({
        targetIdentifier: identifier as string,
        environmentIdentifier: environment.value || NO_ENVIRONMENT_IDENTIFIER,
        projectIdentifier,
        orgIdentifier,
        accountId
      })
    )
  }
  const { showSuccess, showError, clear } = useToaster()
  const deleteTargetParams = useMemo(
    () => ({
      project: projectIdentifier,
      environment: environment?.value,
      account: accountId,
      org: orgIdentifier
    }),
    [environment?.value]
  )
  const { mutate: deleteTarget } = useDeleteTarget({
    queryParams: deleteTargetParams
  })

  const columns: Column<Target>[] = useMemo(
    () => [
      {
        Header: getString('name').toUpperCase(),
        id: 'name',
        accessor: 'name',
        width: '40%',
        Cell: function NameCell(cell: Cell<Target>) {
          return (
            <Layout.Horizontal spacing="xsmall" style={{ alignItems: 'center' }}>
              <Avatar
                name={cell.row.original.name}
                {...DISABLE_AVATAR_PROPS}
                onClick={undefined}
                style={{ cursor: 'pointer' }}
              />
              <Text color={Color.GREY_900}>{cell.row.original.name}</Text>
            </Layout.Horizontal>
          )
        }
      },
      {
        Header: getString('identifier').toUpperCase(),
        id: 'identifier',
        accessor: 'identifier',
        width: '15%',
        Cell: function IdCell(cell: Cell<Target>) {
          return <Text>{cell.row.original.identifier}</Text>
        }
      },
      {
        Header: getString('cf.targets.targetSegment').toUpperCase(),
        id: 'targetSegment',
        accessor: 'attributes',
        width: '25%',
        // TODO: Implement Target Segments when backend sends back data
        Cell: function AttrCell(_cell: Cell<Target>) {
          return <Text>{getString('cf.targets.noneDefined')}</Text>
        }
      },
      {
        Header: getString('cf.targets.createdDate').toUpperCase(),
        id: 'createdAt',
        accessor: 'createdAt',
        width: '20%',
        Cell: function CreateAtCell(cell: Cell<Target>) {
          const deleteTargetConfirm = useConfirmAction({
            title: getString('cf.targets.deleteTarget'),
            message: (
              <Text>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getString('cf.targets.deleteTargetMessage', { name: cell.row.original.name })
                  }}
                ></span>
              </Text>
            ),
            intent: Intent.DANGER,
            action: async () => {
              clear()

              try {
                deleteTarget(cell.row.original.identifier as string)
                  .then(() => {
                    refetchTargets()
                    showSuccess(
                      <Text color={Color.WHITE}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: getString('cf.featureFlags.deleteFlagSuccess', { name: cell.row.original.name })
                          }}
                        />
                      </Text>
                    )
                  })
                  .catch(_error => {
                    showError(getErrorMessage(_error), 0)
                  })
              } catch (err) {
                showError(getErrorMessage(err), 0)
              }
            }
          })

          return (
            <Layout.Horizontal flex={{ distribution: 'space-between', align: 'center-center' }}>
              <Text>
                <ReactTimeago date={moment(cell.row.original.createdAt).toDate()} />
              </Text>
              <Container
                style={{ textAlign: 'right' }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                }}
              >
                <OptionsMenuButton
                  items={[
                    {
                      icon: 'edit',
                      text: getString('edit'),
                      onClick: () => {
                        gotoTargeDetailPage(cell.row.original.identifier as string)
                      }
                    },
                    {
                      icon: 'cross',
                      text: getString('delete'),
                      onClick: deleteTargetConfirm
                    }
                  ]}
                />
              </Container>
            </Layout.Horizontal>
          )
        }
      }
    ],
    [getString]
  )

  useEffect(() => {
    return () => {
      clear()
    }
  }, [clear])

  const content = noTargetExists ? (
    <NoTargetsView
      environmentIdentifier={environment?.value}
      onNewTargetsCreated={() => {
        setPageNumber(0)
        refetchTargets({ queryParams: { ...queryParams, pageNumber: 0 } })
      }}
      hasEnvironment={!!environments.length}
    />
  ) : (
    <Container padding={{ top: 'medium', right: 'xxlarge', left: 'xxlarge' }}>
      <Table<Target>
        columns={columns}
        data={targetsData?.targets || []}
        onRowClick={target => {
          gotoTargeDetailPage(target.identifier as string)
        }}
      />
    </Container>
  )

  return (
    <ListingPageTemplate
      pageTitle={title}
      header={header}
      headerStyle={{ display: 'flex' }}
      toolbar={!error && !noTargetExists && toolbar}
      content={(!error && content) || null}
      pagination={
        !!targetsData?.targets?.length && (
          <Pagination
            itemCount={targetsData?.itemCount || 0}
            pageSize={targetsData?.pageSize || 0}
            pageCount={targetsData?.pageCount || 0}
            pageIndex={pageNumber}
            gotoPage={index => {
              setPageNumber(index)
              refetchTargets({ queryParams: { ...queryParams, pageNumber: index } })
            }}
          />
        )
      }
      loading={loading}
      error={error}
      retryOnError={() => {
        refetchEnvs()
        refetchTargets()
      }}
    />
  )
}
