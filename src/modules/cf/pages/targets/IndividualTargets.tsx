import React, { useState } from 'react'
import ReactTimeago from 'react-timeago'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Container, Button, Layout, Text } from '@wings-software/uikit'
import { Menu, Spinner } from '@blueprintjs/core'
import type { Column } from 'react-table'
import { useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import Table from '@common/components/Table/Table'
import { Page, useToaster } from '@common/exports'
import { Target, useCreateTarget } from 'services/cf'
import { SharedQueryParams } from '@cf/constants'
import CreateTargetModal, { TargetData } from './CreateTargetModal'
import css from './CFTargetsPage.module.scss'

type CustomColumn<T extends object> = Column<T>
const PlaceholderCell: React.FC<any> = () => <Text>TBD</Text>
const TableCell: React.FC<any> = ({ value }) => <Text>{value}</Text>

const LastUpdatedCell: React.FC<any> = ({ value }: any) => {
  const { getString } = useStrings()
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
              <Menu.Item icon="edit" text={getString('edit')} />
              <Menu.Item icon="cross" text={getString('delete')} />
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
  onCreateTargets
}) => {
  const { getString } = useStrings()
  const getPageString = (key: string) => getString(`cf.targets.${key}`)
  const { showError } = useToaster()

  const [loadingBulk, setLoadingBulk] = useState<boolean>(false)
  const history = useHistory()

  const { mutate: createTarget, loading: loadingCreateTarget } = useCreateTarget({
    queryParams: SharedQueryParams
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
          ...SharedQueryParams
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

  const columnDefs: CustomColumn<Target>[] = [
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
  ]

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

  const handleRowClick = ({ identifier }: Target) => {
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
        <Table<Target>
          className={css.table}
          columns={columnDefs}
          data={targets}
          pagination={pagination}
          onRowClick={handleRowClick}
        />
      </Container>
    </Page.Body>
  )
}

export default IndividualTargets
