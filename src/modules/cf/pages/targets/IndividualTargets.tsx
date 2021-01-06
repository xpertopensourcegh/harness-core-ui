import React, { useContext, useMemo, useState } from 'react'
import ReactTimeago from 'react-timeago'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Container, Button, Layout, Text } from '@wings-software/uicore'
import { Menu, Spinner } from '@blueprintjs/core'
import type { Column } from 'react-table'
import { useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import Table from '@common/components/Table/Table'
import { Page, useToaster } from '@common/exports'
import { Target, useCreateTarget, useDeleteTarget } from 'services/cf'
import CreateTargetModal, { TargetData } from './CreateTargetModal'
import css from './CFTargetsPage.module.scss'

type CustomColumn<T extends object> = Column<T>
const PlaceholderCell: React.FC<{}> = () => <Text>TBD</Text>
const TableCell: React.FC<{ value: any }> = ({ value }) => <Text>{value}</Text>

type RowActions = { [P in 'onEdit' | 'onDelete']: (id: string) => void }
const RowContext: React.Context<RowActions | undefined> = React.createContext<RowActions | undefined>(undefined)

type LastUpdatedCellProps = {
  value: any
  cell: any
}
const LastUpdatedCell: React.FC<LastUpdatedCellProps> = ({ value, cell }: LastUpdatedCellProps) => {
  const { getString } = useStrings()
  const { onEdit, onDelete } = useContext(RowContext) ?? {}
  const handleInteraction = (type: 'edit' | 'delete') => () => {
    const id = cell.row.original.identifier
    type === 'edit' ? onEdit?.(id) : onDelete?.(id)
  }

  return (
    <Layout.Horizontal flex={{ distribution: 'space-between', align: 'center-center' }}>
      <ReactTimeago date={moment(value).toDate()} />
      <Container
        style={{ textAlign: 'right' }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
        }}
      >
        <Button
          minimal
          icon="Options"
          iconProps={{ size: 24 }}
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
}

interface IndividualProps {
  targets: Target[]
  environment: string
  project: string
  orgIdentifier: string
  accountId: string
  loading?: boolean
  pagination?: {
    itemCount: number
    pageCount: number
    pageIndex: number
    pageSize: number
    gotoPage: (pageNumber: number) => void
  }
  onCreateTargets: () => void
  onDeleteTarget: () => void
}

type SettledTarget = {
  status: 'fulffiled' | 'rejected'
  data: TargetData
}

const IndividualTargets: React.FC<IndividualProps> = ({
  targets,
  loading,
  project,
  environment,
  pagination,
  orgIdentifier,
  accountId,
  onCreateTargets,
  onDeleteTarget
}) => {
  const { getString } = useStrings()
  const getPageString = (key: string) => getString(`cf.targets.${key}`)
  const { showError } = useToaster()

  const [loadingBulk, setLoadingBulk] = useState<boolean>(false)
  const history = useHistory()

  const { mutate: deleteTarget } = useDeleteTarget({
    queryParams: {
      project,
      environment: environment as string,
      account: accountId,
      org: orgIdentifier
    }
  })

  const { mutate: createTarget, loading: loadingCreateTarget } = useCreateTarget({
    queryParams: { account: accountId, org: orgIdentifier }
  })

  const bulkTargetCreation = (ts: TargetData[]): Promise<SettledTarget[]> => {
    return Promise.all(
      ts.map((t: TargetData) => {
        return createTarget({
          identifier: t.identifier,
          name: t.name,
          anonymous: false,
          attributes: {},
          environment,
          project,
          account: accountId,
          org: orgIdentifier
        })
          .then(() => ({
            status: 'fulfilled',
            data: t
          }))
          .catch(() => ({
            status: 'rejected',
            data: t
          })) as Promise<SettledTarget>
      })
    )
  }

  const columnDefs: CustomColumn<Target>[] = useMemo(
    () => [
      {
        Header: getPageString('name').toLocaleUpperCase(),
        accessor: 'name',
        width: '20%',
        Cell: TableCell
      },
      {
        Header: getPageString('ID'),
        accessor: 'identifier',
        width: '20%',
        Cell: TableCell
      },
      {
        Header: getPageString('targetSegment').toLocaleUpperCase(),
        width: '20%',
        Cell: PlaceholderCell
      },
      {
        Header: getString('featureFlagsText').toLocaleUpperCase(),
        width: '20%',
        Cell: PlaceholderCell
      },
      {
        Header: getPageString('lastActivity').toLocaleUpperCase(),
        accessor: () => new Date(),
        width: '20%',
        Cell: LastUpdatedCell
      }
    ],
    [getString, getPageString]
  )

  const handleTargetCreation = (ts: TargetData[], hideModal: () => void) => {
    setLoadingBulk(true)
    bulkTargetCreation(ts)
      .then(results => {
        if (results.every(res => res.status === 'rejected')) {
          return Promise.reject(results)
        }
        results
          .filter(res => res.status === 'rejected')
          .forEach((res: SettledTarget) => {
            showError(`Error creating target with id ${res.data.identifier}`)
          })
      })
      .then(hideModal)
      .then(onCreateTargets)
      .catch(results => {
        results.forEach((res: SettledTarget) => {
          showError(`Error creating target with id ${res.data.identifier}`)
        })
      })
      .finally(() => setLoadingBulk(false))
  }

  const handleTargetUpload = (file: File, hideModal: () => void) => {
    file
      .text()
      .then((str: string) => {
        return str
          .split(/\r?\n/)
          .map(row => row.split(',').map(x => x.trim()))
          .map(([name, identifier]) => ({ name, identifier } as TargetData))
      })
      .then((ts: TargetData[]) => handleTargetCreation(ts, hideModal))
  }

  const handleRowClick = ({ identifier }: Pick<Target, 'identifier'>) => {
    history.push(
      routes.toCFTargetDetails({
        targetIdentifier: identifier as string,
        environmentIdentifier: environment,
        projectIdentifier: project,
        orgIdentifier,
        accountId
      })
    )
  }

  const handleEditRow = (identifier: string) => handleRowClick({ identifier })
  const handleDeleteRow = (id: string) => {
    deleteTarget(id)
      .then(onDeleteTarget)
      .catch(() => {
        showError(`Could not delete target ${id}`)
      })
  }

  if (loading) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }

  return (
    <Page.Body>
      <Container style={{ width: '100%' }} className={css.header}>
        <CreateTargetModal
          loading={loadingCreateTarget || loadingBulk}
          onSubmitTargets={handleTargetCreation}
          onSubmitUpload={handleTargetUpload}
        />
      </Container>
      <Container flex className={css.content}>
        <RowContext.Provider
          value={{
            onDelete: handleDeleteRow,
            onEdit: handleEditRow
          }}
        >
          <Table<Target>
            className={css.table}
            columns={columnDefs}
            data={targets}
            pagination={pagination}
            onRowClick={handleRowClick}
          />
        </RowContext.Provider>
      </Container>
    </Page.Body>
  )
}

export default IndividualTargets
