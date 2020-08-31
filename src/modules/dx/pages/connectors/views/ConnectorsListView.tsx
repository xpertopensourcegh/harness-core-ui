import React, { useState, useMemo } from 'react'
import { Text, Layout, Color, Icon, Button, Popover } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import { Menu, Classes, Position, PopoverInteractionKind } from '@blueprintjs/core'
import { useParams, useHistory } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { ConnectorSummaryDTO, useDeleteConnector, NGPageResponseConnectorSummaryDTO } from 'services/cd-ng'
import Table from 'modules/common/components/Table/Table'
import { useConfirmationDialog } from 'modules/common/exports'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import { routeConnectorDetails } from 'modules/dx/routes'
import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import VerifyExistingDelegate from 'modules/dx/common/VerfiyExistingDelegate/VerifyExistingDelegate'
import { getIconByType } from '../utils/ConnectorUtils'

import i18n from './ConnectorsListView.i18n'
import css from './ConnectorsListView.module.scss'

interface ConnectorListViewProps {
  data?: NGPageResponseConnectorSummaryDTO
  reload?: () => Promise<void>
  gotoPage: (pageNumber: number) => void
}

type CustomColumn<T extends object> = Column<T> & {
  reload?: () => Promise<void>
}

const RenderColumnConnector: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name={getIconByType(data.type)} size={30}></Icon>
      <div>
        <Layout.Horizontal spacing="small">
          <Text color={Color.BLACK}>{data.name}</Text>
          {data.tags?.length ? <TagsPopover tags={data.tags} /> : null}
        </Layout.Horizontal>
        <Text color={Color.GREY_400}>{data.accountName}</Text>
      </div>
    </Layout.Horizontal>
  )
}
const RenderColumnDetails: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  return (
    <div>
      {data.connectorDetails ? <Text color={Color.BLACK}>{data.connectorDetails.masterURL}</Text> : null}
      <Text color={Color.GREY_400}>{data.description}</Text>
    </div>
  )
}

const RenderColumnActivity: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {data.lastModifiedAt ? <ReactTimeago date={data.lastModifiedAt} /> : null}
    </Layout.Horizontal>
  )
}
const RenderColumnStatus: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row }) => {
  const data = row.original
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState(data.status?.status as string)
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  return (
    <Layout.Horizontal>
      {!testing ? (
        <Layout.Vertical width="100px">
          <Layout.Horizontal spacing="small">
            {data.status?.status ? (
              <Text
                inline
                icon={data.status.status === 'SUCCESS' ? 'full-circle' : 'warning-sign'}
                iconProps={{
                  size: data.status.status === 'SUCCESS' ? 6 : 12,
                  color: data.status.status === 'SUCCESS' ? Color.GREEN_500 : Color.RED_500
                }}
              >
                {status === 'SUCCESS' ? i18n.success : i18n.failed}
              </Text>
            ) : null}
          </Layout.Horizontal>
          {data.status ? (
            <Text font={{ size: 'small' }} color={Color.GREY_400}>
              {<ReactTimeago date={data.status?.lastTestedAt || ''} />}
            </Text>
          ) : null}
        </Layout.Vertical>
      ) : (
        <Layout.Horizontal>
          <Popover interactionKind={PopoverInteractionKind.HOVER} position={Position.LEFT_TOP}>
            <Button intent="primary" minimal loading />
            <div className={css.testConnectionPop}>
              {data?.connectorDetails?.delegateName ? (
                <VerifyExistingDelegate
                  accountId={accountId}
                  orgIdentifier={orgIdentifier}
                  projectIdentifier={projectIdentifier}
                  connectorName={data.name}
                  connectorIdentifier={data.identifier}
                  // inPopover={true}
                  // setStatus={setStatus}
                  // setTesting={setTesting}
                />
              ) : (
                <VerifyOutOfClusterDelegate
                  accountId={accountId}
                  orgIdentifier={orgIdentifier}
                  projectIdentifier={projectIdentifier}
                  connectorName={data.name}
                  connectorIdentifier={data.identifier}
                  inPopover={true}
                  setStatus={setStatus}
                  setTesting={setTesting}
                />
              )}
            </div>
          </Popover>
          <Text style={{ margin: 8 }}>{i18n.TestInProgress}</Text>
        </Layout.Horizontal>
      )}
      {!testing && data.status?.status === 'FAILURE' ? (
        <Button
          font="small"
          className={css.testBtn}
          text={i18n.TEST_CONNECTION}
          onClick={e => {
            e.stopPropagation()
            setTesting(true)
          }}
        />
      ) : null}
    </Layout.Horizontal>
  )
}

const RenderColumnMenu: Renderer<CellProps<ConnectorSummaryDTO>> = ({ row, column }) => {
  const data = row.original
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams()

  const { mutate: deleteConnector } = useDeleteConnector({
    accountIdentifier: accountId,
    queryParams: { orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier }
  })

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancelButton,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteConnector(data.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })

          if (deleted) showSuccess(`Connector ${data.name} deleted`)
          ;(column as any).reload?.()
        } catch (err) {
          showError(err)
        }
      }
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    if (!data?.identifier) return
    openDialog()
  }

  return (
    <Layout.Horizontal className={css.layout}>
      <Popover
        isOpen={menuOpen}
        onInteraction={nextOpenState => {
          setMenuOpen(nextOpenState)
        }}
        className={Classes.DARK}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          minimal
          icon="main-more"
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu style={{ minWidth: 'unset' }}>
          <Menu.Item icon="edit" text="Edit" />
          <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const ConnectorsListView: React.FC<ConnectorListViewProps> = props => {
  const { data, reload, gotoPage } = props
  const history = useHistory()
  const columns: CustomColumn<ConnectorSummaryDTO>[] = useMemo(
    () => [
      {
        Header: i18n.connector.toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnConnector
      },
      {
        Header: i18n.details.toUpperCase(),
        accessor: 'description',
        width: '25%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.lastActivity.toUpperCase(),
        accessor: 'lastModifiedAt',
        width: '20%',
        Cell: RenderColumnActivity
      },
      {
        Header: i18n.status.toUpperCase(),
        accessor: 'status',
        width: '25%',
        Cell: RenderColumnStatus
      },
      {
        Header: '',
        accessor: 'identifier',
        width: '5%',
        Cell: RenderColumnMenu,
        reload: reload,
        disableSortBy: true
      }
    ],
    [reload]
  )
  return (
    <Table<ConnectorSummaryDTO>
      className={css.table}
      columns={columns}
      data={data?.content || []}
      onRowClick={connector => {
        history.push(routeConnectorDetails.url({ connectorId: connector.identifier as string }))
      }}
      pagination={{
        itemCount: data?.itemCount || 0,
        pageSize: data?.pageSize || 10,
        pageCount: data?.pageCount || -1,
        pageIndex: data?.pageIndex || 0,
        gotoPage
      }}
    />
  )
}

export default ConnectorsListView
