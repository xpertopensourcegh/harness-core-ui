import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import type { CellProps, Renderer, Column } from 'react-table'
import { Button, Container, Intent, Tag, Layout, Popover } from '@wings-software/uicore'
import { Menu, Classes, Position } from '@blueprintjs/core'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useStrings } from 'framework/exports'
import { useDeleteDelegate } from 'services/portal/index'
import routes from '@common/RouteDefinitions'
import Table from '@common/components/Table/Table'
import useDeleteDelegateModal from '../../modals/DeleteDelegateModal/useDeleteDelegateModal'
import success from './success.svg'

import css from './DelegatesPage.module.scss'

interface DelegateListingProps {
  delegateResponse: any
  onClick: any
}

interface Delegate {
  uuid: string
  status: string
  connections: string[]
  delegateName: string
  hostName: string
  lastHeartBeat: number
  tags?: string[]
}

const delegateStatus = (delegate: Delegate) => {
  const isApprovalRequired = delegate.status === 'WAITING_FOR_APPROVAL'
  const isConnected = delegate.connections ? delegate?.connections?.length > 0 : false
  return isApprovalRequired ? 'Pending Approval' : isConnected ? 'Connected' : 'Not Connected'
}

const RenderConnectivityColumn: Renderer<CellProps<Delegate>> = ({ row }) => {
  return (
    <Container className={css.connectivity}>
      <img src={success} alt="" aria-hidden />
      {row.values.connectivity}
    </Container>
  )
}

const RenderTagsColumn: Renderer<CellProps<Delegate>> = ({ row }) => {
  if (!row.values.tags || !row.values.tags.length) {
    return null
  }
  return (
    <Container className={css.connectivity}>
      {row.values.tags.map((tag: string) => {
        return (
          <Tag intent={Intent.PRIMARY} minimal={true} key={tag}>
            <span>{tag}</span>
          </Tag>
        )
      })}
    </Container>
  )
}

const RenderColumnMenu: Renderer<CellProps<Delegate>> = ({ row, column }) => {
  const data = row.original.uuid
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { accountId } = useParams()
  const { mutate: deleteDelegate } = useDeleteDelegate({
    queryParams: { accountId: accountId }
  })
  const { openDialog } = useDeleteDelegateModal({
    delegateName: row.original.delegateName,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteDelegate(data)

          if (deleted) {
            showSuccess(`Delegate ${row.original.delegateName} deleted`)
            ;(column as any).reload?.()
          }
        } catch (error) {
          showError(error.message)
        }
      }
    }
  })
  const { getString } = useStrings()
  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    // if (!data?.connector?.identifier) return
    openDialog()
  }

  return (
    <Layout.Horizontal>
      <Popover
        isOpen={menuOpen}
        onInteraction={nextOpenState => {
          setMenuOpen(nextOpenState)
        }}
        className={Classes.DARK}
        position={Position.RIGHT_TOP}
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
          <Menu.Item icon="edit" text={getString('reinstall')} />
          <Menu.Item icon="trash" text={getString('delete')} onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

export const DelegateListing: React.FC<DelegateListingProps> = (props: DelegateListingProps) => {
  const { getString } = useStrings()
  const { accountId } = useParams()
  const history = useHistory()
  if (!props.delegateResponse) {
    return <div>Delegate Listing</div>
  }

  const {
    delegateResponse: {
      resource: { delegates }
    }
  } = props
  const columns: Column<Delegate>[] = [
    {
      Header: getString('delegate.DelegateName'),
      accessor: (row: Delegate) => row.delegateName || row.hostName,
      id: 'name',
      width: '30%'
    },
    {
      Header: getString('tagsLabel'),
      accessor: (row: Delegate) => row.tags,
      id: 'tags',
      Cell: RenderTagsColumn
    },
    {
      Header: getString('delegate.LastHeartBeat'),
      accessor: (row: Delegate) => moment(row.lastHeartBeat).fromNow(),
      id: 'lastHeartBeat'
    },
    {
      Header: getString('filters.connectivityStatus'),
      accessor: (row: Delegate) => delegateStatus(row),
      id: 'connectivity',
      Cell: RenderConnectivityColumn
    },
    {
      Header: '',
      accessor: (row: Delegate) => row?.uuid,

      id: 'action',
      Cell: RenderColumnMenu
    }
  ]
  return (
    <Container className={css.delegateContainer}>
      <Button
        id="delegateButton"
        intent="primary"
        text={getString('delegate.NEW_DELEGATE')}
        icon="plus"
        onClick={props.onClick}
      />
      <Table
        columns={columns}
        data={delegates}
        className={css.delegateTable}
        onRowClick={item => {
          history.push(
            routes.toResourcesDelegatesDetails({
              accountId,
              delegateId: item.uuid
            })
          )
        }}
      />
    </Container>
  )
}
export default DelegateListing
