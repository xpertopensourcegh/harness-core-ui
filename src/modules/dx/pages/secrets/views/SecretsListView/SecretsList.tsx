import React, { useMemo, useState } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
// import ReactTimeago from 'react-timeago'
import { Menu, Position, Classes } from '@blueprintjs/core'
import type { Column, Renderer, CellProps } from 'react-table'
import { Text, Color, Layout, Icon, Button, Popover } from '@wings-software/uikit'

import Table from 'modules/common/components/Table/Table'
import { routeSecretDetails } from 'modules/dx/routes'
import { useToaster, useConfirmationDialog } from 'modules/common/exports'
import { useDeleteSecretV2 } from 'services/cd-ng'
import type { NGPageResponseSecretDTOV2, SecretDTOV2, SecretTextSpecDTO } from 'services/cd-ng'

// import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import i18n from '../../SecretsPage.i18n'
import css from './SecretsList.module.scss'

interface SecretsListProps {
  secrets?: NGPageResponseSecretDTOV2
  gotoPage: (pageNumber: number) => void
  refetch?: () => void
}

const getStringForType = (type?: SecretDTOV2['type']): string => {
  if (!type) return ''
  switch (type) {
    case 'SecretText':
      return i18n.typeText
    case 'SecretFile':
      return i18n.typeFile
    case 'SSHKey':
      return i18n.typeSSH
    default:
      return ''
  }
}

const RenderColumnSecret: Renderer<CellProps<SecretDTOV2>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal>
      {data.type === 'SecretText' || data.type === 'SecretFile' ? (
        <Icon name="key" size={28} margin={{ top: 'xsmall', right: 'small' }} />
      ) : null}
      {data.type === 'SSHKey' ? <Icon name="secret-ssh" size={28} margin={{ top: 'xsmall', right: 'small' }} /> : null}
      <Layout.Vertical>
        <Layout.Horizontal spacing="small">
          <Text color={Color.BLACK}>{data.name}</Text>
          {/* TODO {Abhinav} Enable tags once spec is finalized */}
          {/* {data.tags?.length ? <TagsPopover tags={data.tags} /> : null} */}
        </Layout.Horizontal>
        <Text color={Color.GREY_400}>{data.identifier}</Text>
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

const RenderColumnDetails: Renderer<CellProps<SecretDTOV2>> = ({ row }) => {
  const data = row.original
  return (
    <>
      {data.type === 'SecretText' || data.type === 'SecretFile' ? (
        <Text color={Color.BLACK}>{(data.spec as SecretTextSpecDTO).secretManagerIdentifier}</Text>
      ) : null}
      {/* TODO {Abhinav} display SM name */}
      <Text color={Color.GREY_400}>{getStringForType(data.type)}</Text>
    </>
  )
}

const RenderColumnActivity: Renderer<CellProps<SecretDTOV2>> = () => {
  // const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {/* {data.lastUpdatedAt ? <ReactTimeago date={data.lastUpdatedAt} /> : null} */}
      {/* Temporary, until spec for 'lastUpdateAt' is finalized */}
      <Text>4 minutes ago</Text>
    </Layout.Horizontal>
  )
}

const RenderColumnStatus: Renderer<CellProps<SecretDTOV2>> = ({ row }) => {
  const data = row.original
  if (data.type === 'SecretText' || data.type === 'SecretFile') {
    return (data.spec as SecretTextSpecDTO).draft ? (
      <Text icon="warning-sign" intent="warning">
        {i18n.incompleteSecret}
      </Text>
    ) : null
  }
  return null
}

const RenderColumnAction: Renderer<CellProps<SecretDTOV2>> = ({ row, column }) => {
  const data = row.original
  const history = useHistory()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
  const [menuOpen, setMenuOpen] = useState(false)
  const { mutate: deleteSecret } = useDeleteSecretV2({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
    requestOptions: { headers: { 'content-type': 'application/json' } }
  })

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.btnDelete,
    cancelButtonText: i18n.btnCancel,
    onCloseDialog: async didConfirm => {
      if (didConfirm && data.identifier) {
        try {
          await deleteSecret(data.identifier)
          showSuccess(`Secret ${data.name} deleted`)
          ;(column as any).refreshSecrets?.()
        } catch (err) {
          showError(err.message)
        }
      }
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    openDialog()
  }

  const handleEdit = (): void => {
    history.replace({
      pathname: routeSecretDetails.url({ secretId: data.identifier as string }),
      search: '?edit=true'
    })
  }

  return (
    <Layout.Horizontal style={{ justifyContent: 'flex-end' }}>
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
          icon="options"
          iconProps={{ size: 24 }}
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu>
          <Menu.Item icon="edit" text="Edit" onClick={handleEdit} />
          <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const SecretsList: React.FC<SecretsListProps> = ({ secrets, refetch, gotoPage }) => {
  const history = useHistory()
  const data: SecretDTOV2[] = useMemo(() => secrets?.content || [], [secrets?.content])
  const { pathname } = useLocation()
  const columns: Column<SecretDTOV2>[] = useMemo(
    () => [
      {
        Header: i18n.table.secret,
        accessor: 'name',
        width: '30%',
        Cell: RenderColumnSecret
      },
      {
        Header: i18n.table.secretManager,
        accessor: 'description',
        width: '25%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.table.lastActivity,
        accessor: 'tags',
        width: '20%',
        Cell: RenderColumnActivity
      },
      {
        Header: '',
        accessor: 'type',
        width: '20%',
        Cell: RenderColumnStatus,
        refreshSecrets: refetch,
        disableSortBy: true
      },
      {
        Header: '',
        accessor: 'identifier',
        width: '5%',
        Cell: RenderColumnAction,
        refreshSecrets: refetch,
        disableSortBy: true
      }
    ],
    [refetch]
  )

  return (
    <Table<SecretDTOV2>
      className={css.table}
      columns={columns}
      data={data}
      onRowClick={secret => {
        history.push(`${pathname}/${secret.identifier}`)
      }}
      pagination={{
        itemCount: secrets?.itemCount || 0,
        pageSize: secrets?.pageSize || 10,
        pageCount: secrets?.pageCount || -1,
        pageIndex: secrets?.pageIndex || 0,
        gotoPage
      }}
    />
  )
}

export default SecretsList
