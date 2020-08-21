import React, { useMemo, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { Menu, Position, Classes } from '@blueprintjs/core'
import type { Column, Renderer, CellProps } from 'react-table'
import { Text, Color, Layout, Icon, Button, Popover } from '@wings-software/uikit'

import Table from 'modules/common/components/Table/Table'
import { routeSecretDetails } from 'modules/dx/routes'
import { useToaster, useConfirmationDialog } from 'modules/common/exports'
import { useDeleteSecret, ResponseDTONGPageResponseEncryptedDataDTO } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'

import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import i18n from '../../SecretsPage.i18n'
import css from './SecretsList.module.scss'

const getStringForType = (type?: EncryptedDataDTO['type']): string => {
  if (!type) return ''
  switch (type) {
    case 'SecretText':
      return 'Text'
    case 'SecretFile':
      return 'File'
    default:
      return ''
  }
}

const RenderColumnSecret: Renderer<CellProps<EncryptedDataDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal>
      <Icon name="key" size={28} padding={{ top: 'xsmall', right: 'small' }} />
      <Layout.Vertical>
        <Layout.Horizontal spacing="small">
          <Text color={Color.BLACK}>{data.name}</Text>
          {data.tags?.length ? <TagsPopover tags={data.tags} /> : null}
        </Layout.Horizontal>
        <Text color={Color.GREY_400}>{data.identifier}</Text>
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

const RenderColumnDetails: Renderer<CellProps<EncryptedDataDTO>> = ({ row }) => {
  const data = row.original
  return (
    <>
      <Text color={Color.BLACK}>{data.secretManagerName || data.secretManager}</Text>
      <Text color={Color.GREY_400}>{getStringForType(data.type)}</Text>
    </>
  )
}

const RenderColumnActivity: Renderer<CellProps<EncryptedDataDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {data.lastUpdatedAt ? <ReactTimeago date={data.lastUpdatedAt} /> : null}
    </Layout.Horizontal>
  )
}

const RenderColumnStatus: Renderer<CellProps<EncryptedDataDTO>> = ({ row }) => {
  const data = row.original
  return data.draft ? (
    <Text icon="warning-sign" intent="warning">
      {i18n.incompleteSecret}
    </Text>
  ) : null
}

const RenderColumnAction: Renderer<CellProps<EncryptedDataDTO>> = ({ row, column }) => {
  const data = row.original
  const history = useHistory()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
  const [menuOpen, setMenuOpen] = useState(false)
  const { mutate: deleteSecret } = useDeleteSecret({
    queryParams: { account: accountId, project: projectIdentifier, org: orgIdentifier },
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
          icon="more"
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

interface SecretsListProps {
  secrets?: ResponseDTONGPageResponseEncryptedDataDTO
  gotoPage: (pageNumber: number) => void
  refetch?: () => void
}

const SecretsList: React.FC<SecretsListProps> = ({ secrets, refetch, gotoPage }) => {
  const history = useHistory()
  const data: EncryptedDataDTO[] = useMemo(() => secrets?.data?.content || [], [secrets?.data?.content])

  const columns: Column<EncryptedDataDTO>[] = useMemo(
    () => [
      {
        Header: i18n.table.secret,
        accessor: 'name',
        width: '30%',
        Cell: RenderColumnSecret
      },
      {
        Header: i18n.table.secretManager,
        accessor: 'secretManager',
        width: '25%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.table.lastActivity,
        accessor: 'lastUpdatedAt',
        width: '20%',
        Cell: RenderColumnActivity
      },
      {
        Header: '',
        accessor: 'draft',
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
    <Table<EncryptedDataDTO>
      className={css.table}
      columns={columns}
      data={data}
      onRowClick={secret => {
        history.push(
          routeSecretDetails.url({
            secretId: secret.identifier as string
          })
        )
      }}
      pagination={{
        itemCount: secrets?.data?.itemCount || 0,
        pageSize: secrets?.data?.pageSize || 10,
        pageCount: secrets?.data?.pageCount || -1,
        pageIndex: secrets?.data?.pageIndex || 0,
        gotoPage
      }}
    />
  )
}

export default SecretsList
