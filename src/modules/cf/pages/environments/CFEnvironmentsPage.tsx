import React, { useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import type { Column } from 'react-table'
import { get } from 'lodash-es'
import { Menu, Position } from '@blueprintjs/core'
import { Button, Color, Container, Layout, Text } from '@wings-software/uicore'
import { EnvironmentResponseDTO, useDeleteEnvironment, useGetEnvironmentListForProject } from 'services/cd-ng'
import Table from '@common/components/Table/Table'
import { Page, useConfirmationDialog, useToaster } from '@common/exports'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { PageError } from '@common/components/Page/PageError'
import { useEnvStrings } from '@cf/hooks/environment'
import EnvironmentDialog from '@cf/components/CreateEnvironmentDialog/EnvironmentDialog'
import routes from '@common/RouteDefinitions'
import { withTableData } from '../../utils/table-utils'
import css from './CFEnvironmentsPage.module.scss'

type Environment = EnvironmentResponseDTO
type EnvData = { environment: Environment }
const withEnvironment = withTableData<Environment, EnvData>(({ row }) => ({ environment: row.original }))
const withActions = withTableData<
  Environment,
  EnvData & { actions: { [P in 'onEdit' | 'onDelete']?: (id: string) => void } }
>(({ row, column }) => ({
  environment: row.original,
  actions: (column as any).actions as { [P in 'onEdit' | 'onDelete']?: (id: string) => void }
}))

const PRODUCTION = 'Production'
const TypeCell = withEnvironment(({ environment }) => {
  const { getString } = useEnvStrings()
  return <Text>{getString(environment.type === PRODUCTION ? 'production' : 'nonProduction')}</Text>
})

const NameCell = withEnvironment(({ environment }) => {
  const { getString } = useEnvStrings()
  const showDescription = environment?.description?.length !== undefined && environment.description.length > 0
  const tags = Object.entries(environment.tags ?? {}).reduce((acc: any[], [key, value]: [string, string]) => {
    return [...acc, { name: key, value: value }]
  }, [])
  return (
    <Layout.Horizontal flex={{ distribution: 'space-between', align: 'center-center' }} padding={{ right: 'small' }}>
      <Layout.Vertical spacing="xsmall">
        <Text font={{ weight: 'bold', size: 'medium' }}>{environment.name}</Text>
        {showDescription && <Text>{environment.description}</Text>}
        <Text
          font={{ weight: 'semi-bold' }}
          background={Color.BLUE_300}
          width="fit-content"
          padding={{ left: 'xsmall', right: 'xsmall' }}
        >
          {environment.identifier}
        </Text>
      </Layout.Vertical>
      <Layout.Horizontal>
        <Text
          width="100px"
          flex
          icon="main-tags"
          style={{ justifyContent: 'center' }}
          tooltip={
            tags.length ? (
              <>
                <Text>{getString('tagsLabel').toUpperCase()}</Text>
                {tags.map((elem, i) => (
                  <Text key={`${elem.value}-${i}`}>{elem.value}</Text>
                ))}
              </>
            ) : undefined
          }
          tooltipProps={{
            portalClassName: css.tagsPopover,
            position: Position.RIGHT
          }}
        >
          {tags.length}
        </Text>
      </Layout.Horizontal>
    </Layout.Horizontal>
  )
})

const ModilfiedByCell = withActions(({ environment, actions }) => {
  const { getString, getEnvString } = useEnvStrings()

  const id = environment.identifier as string

  const { openDialog } = useConfirmationDialog({
    confirmButtonText: getString('delete'),
    cancelButtonText: getString('cancel'),
    contentText: getEnvString('delete.message', { environmentName: environment.name }),
    titleText: getEnvString('delete.title'),
    onCloseDialog: (isConfirmed: boolean) => {
      isConfirmed && actions.onDelete?.(id)
    }
  })

  const handleInteraction = (type: 'edit' | 'delete') => () => {
    type === 'edit' ? actions.onEdit?.(id) : openDialog()
  }
  return (
    <Layout.Horizontal style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* TODO: Add user info when BE is ready */}
      <Container
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
        }}
      >
        <Button
          minimal
          icon="Options"
          iconProps={{ size: 24 }}
          style={{ marginLeft: 'auto' }}
          tooltip={
            <Menu style={{ minWidth: 'unset' }}>
              <Menu.Item icon="edit" text={getString('edit')} onClick={handleInteraction('edit')} />
              <Menu.Item icon="cross" text={getString('delete')} onClick={handleInteraction('delete')} />
            </Menu>
          }
          tooltipProps={{ isDark: true, interactionKind: 'click' }}
        />
      </Container>
    </Layout.Horizontal>
  )
})

type CustomColumn<T extends Record<string, any>> = Column<T>

const CFEnvironmentsPage: React.FC<{}> = () => {
  const { getEnvString, getString } = useEnvStrings()
  const { showError, showSuccess } = useToaster()
  const history = useHistory()
  const { accountId, projectIdentifier, orgIdentifier } = useParams<Record<string, string>>()

  const { data: envData, loading, error, refetch } = useGetEnvironmentListForProject({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  const { mutate: deleteEnvironment } = useDeleteEnvironment({
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  const environments = envData?.data?.content
  const hasEnvs = Boolean(!loading && envData?.data?.content?.length)
  const emptyEnvs = Boolean(!loading && envData?.data?.content?.length === 0)

  const handleEdit = (id: string) => {
    history.push(
      routes.toCFEnvironmentDetails({
        environmentIdentifier: id,
        projectIdentifier,
        orgIdentifier,
        accountId
      })
    )
  }

  const handleDeleteEnv = async (id: string) => {
    try {
      await deleteEnvironment(id)
      showSuccess(`Successfully deleted environment ${id}`)
      refetch()
    } catch (e) {
      showError(get(e, 'data.message', e?.message))
    }
  }

  const columns: CustomColumn<Environment>[] = useMemo(
    () => [
      {
        Header: getString('environment').toUpperCase(),
        id: 'name',
        width: '45%',
        accessor: 'name',
        Cell: NameCell
      },
      {
        Header: getString('typeLabel').toUpperCase(),
        id: 'type',
        accessor: 'type',
        width: '45%',
        Cell: TypeCell
      },
      // {
      // TODO: Commenting column at the moment. Uncomment when BE is ready
      // Header: getEnvString('createdBy').toUpperCase(),
      // id: 'createdBy',
      // width: '20%',
      // Cell: CreatedByCell,
      // },
      {
        // TODO: Hiding header at the moment. Uncomment when BE is ready
        // Header: getEnvString('modifiedBy').toUpperCase(),
        id: 'modifiedBy',
        width: '10%',
        Cell: ModilfiedByCell,
        actions: {
          onEdit: handleEdit,
          onDelete: handleDeleteEnv
        }
      }
    ],
    [getString, getEnvString, handleDeleteEnv]
  )

  return (
    <>
      <Page.Header title={getEnvString('title')} size="medium" />
      <Container className={css.envListContainer}>
        <Layout.Horizontal className={css.envPageBtnsHeader}>
          <EnvironmentDialog disabled={loading} onCreate={refetch} />
        </Layout.Horizontal>
        {hasEnvs && (
          <Layout.Vertical
            padding={{
              top: 'medium',
              bottom: 'medium',
              left: 'large',
              right: 'large'
            }}
          >
            <Table<Environment>
              columns={columns}
              data={(environments as Environment[]) || []}
              onRowClick={({ identifier }) => handleEdit(identifier as string)}
              pagination={{
                itemCount: envData?.data?.totalItems || 0,
                pageSize: envData?.data?.pageSize || 7,
                pageCount: envData?.data?.totalPages || -1,
                pageIndex: envData?.data?.pageIndex || 0,
                gotoPage: () => undefined
              }}
            />
          </Layout.Vertical>
        )}
        {emptyEnvs && (
          <Layout.Vertical className={css.heightOverride}>
            <Text font="large" margin={{ bottom: 'huge' }} color="grey400">
              {getEnvString('empty')}
            </Text>
            <EnvironmentDialog onCreate={refetch} />
          </Layout.Vertical>
        )}
        {error && <PageError message={error?.message} onClick={() => refetch()} />}
        {loading && (
          <Container
            style={{
              position: 'fixed',
              top: '144px',
              left: '270px',
              width: 'calc(100% - 270px)',
              height: 'calc(100% - 144px)'
            }}
          >
            <ContainerSpinner />
          </Container>
        )}
      </Container>
    </>
  )
}

export default CFEnvironmentsPage
