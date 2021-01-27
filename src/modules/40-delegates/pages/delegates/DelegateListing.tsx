import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import type { CellProps, Renderer, Column } from 'react-table'
import { Button, Container, Intent, Tag, Text, Layout, Popover, Color } from '@wings-software/uicore'
import { Menu, Classes, Position } from '@blueprintjs/core'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useStrings } from 'framework/exports'
import { useDeleteDelegate } from 'services/portal/index'
import routes from '@common/RouteDefinitions'
import { Page } from 'modules/10-common/exports'
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
    <Layout.Horizontal className={css.connectivity}>
      <img src={success} alt="" aria-hidden className={css.successIcon} />
      <Text>{row.values.connectivity}</Text>
    </Layout.Horizontal>
  )
}

const RenderNameColumn: Renderer<CellProps<Delegate>> = ({ row }) => {
  const data = row.values
  return (
    <>
      <Layout.Horizontal spacing="small" data-testid={data.hostName}>
        <Layout.Vertical padding={{ left: 'small' }}>
          <Layout.Horizontal spacing="small" data-testid={data.hostName}>
            <Text color={Color.BLACK}>{data.delegateName || data.name}</Text>
          </Layout.Horizontal>
          <Text color={Color.GREY_400}>{data.name}</Text>
        </Layout.Vertical>
      </Layout.Horizontal>
    </>
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
    <Layout.Horizontal style={{ justifyContent: 'flex-end' }}>
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
  // if (!props.delegateResponse) {
  //   return <div>Delegate Listing</div>
  // }

  const {
    delegateResponse: {
      resource: { delegates }
    }
  } = props
  const columns: Column<Delegate>[] = [
    {
      Header: getString('delegate.DelegateName'),
      accessor: (row: Delegate) => row.delegateName || row.hostName,
      width: '25%',
      id: 'name',
      Cell: RenderNameColumn
    },
    {
      Header: getString('tagsLabel'),
      accessor: (row: Delegate) => row.tags,
      id: 'tags',
      width: '25%',
      Cell: RenderTagsColumn
    },
    {
      Header: getString('delegate.LastHeartBeat'),
      accessor: (row: Delegate) => moment(row.lastHeartBeat).fromNow(),
      id: 'lastHeartBeat',
      width: '20%'
    },
    {
      Header: getString('filters.connectivityStatus'),
      accessor: (row: Delegate) => delegateStatus(row),
      id: 'connectivity',
      width: '25%',
      disableSortBy: true,
      Cell: RenderConnectivityColumn
    },
    {
      Header: '',
      width: '5%',
      accessor: (row: Delegate) => row?.uuid,
      disableSortBy: true,
      id: 'action',
      Cell: RenderColumnMenu
    }
  ]
  return (
    <Container>
      <Layout.Horizontal className={css.header}>
        <Layout.Horizontal inline width="50%">
          <Button
            id="delegateButton"
            intent="primary"
            text={getString('delegate.NEW_DELEGATE')}
            icon="plus"
            onClick={props.onClick}
          />
        </Layout.Horizontal>
        <Container flex className={css.view}>
          <Layout.Horizontal spacing="small" width="30%" className={css.view}>
            <Button icon="main-search" placeholder={getString('search')} />
          </Layout.Horizontal>
          <Layout.Horizontal spacing="small" width="20%" className={css.view}>
            <Button id="ngfilterbtn" icon="ng-filter" width="32px" height="32px" />
          </Layout.Horizontal>
        </Container>
      </Layout.Horizontal>

      <Page.Body>
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
      </Page.Body>
    </Container>
  )
}
export default DelegateListing
