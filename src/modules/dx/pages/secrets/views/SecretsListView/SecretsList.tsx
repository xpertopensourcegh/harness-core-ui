import React, { useMemo, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { Menu, Position, Classes, PopoverInteractionKind } from '@blueprintjs/core'
import type { Column, Renderer, CellProps } from 'react-table'
import { Text, Color, Layout, Icon, Button, Popover, Tag, Container } from '@wings-software/uikit'

import Table from 'modules/common/components/Table/Table'
import { routeSecretDetails } from 'modules/dx/routes'
import { useToaster, useConfirmationDialog } from 'modules/common/exports'
import { useDeleteSecretText } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'
import { linkTo } from 'framework/exports'

import i18n from '../../SecretsPage.i18n'
import css from './SecretsList.module.scss'

const SecretType = {
  SECRET_TEXT: 'SECRET_TEXT',
  CONFIG_FILE: 'CONFIG_FILE'
}

const getStringForType = (type?: string): string => {
  if (!type) return ''
  switch (type) {
    case SecretType.SECRET_TEXT:
      return 'Text'
    case SecretType.CONFIG_FILE:
      return 'File'
    default:
      return 'Other'
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
          {data.tags?.length ? (
            <Popover interactionKind={PopoverInteractionKind.HOVER}>
              <Layout.Horizontal flex={{ align: 'center-center' }} spacing="xsmall">
                <Icon name="main-tags" size={15} />
                <Text>{data.tags.length}</Text>
              </Layout.Horizontal>
              <Container padding="small">
                {data.tags?.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Container>
            </Popover>
          ) : null}
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
      <Text color={Color.BLACK}>{data.secretManagerIdentifier}</Text>
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

const RenderColumnAction: Renderer<CellProps<EncryptedDataDTO>> = ({ row, column }) => {
  const data = row.original
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
  const [menuOpen, setMenuOpen] = useState(false)
  const { mutate: deleteSecret } = useDeleteSecretText({
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
          showError(err)
        }
      }
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    openDialog()
  }

  return (
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
        <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
      </Menu>
    </Popover>
  )
}

interface SecretsListProps {
  secrets?: EncryptedDataDTO[]
  refetch?: () => void
}

const SecretsList: React.FC<SecretsListProps> = ({ secrets, refetch }) => {
  const history = useHistory()
  const data: EncryptedDataDTO[] = useMemo(() => secrets || [], [secrets])

  const columns: Column<EncryptedDataDTO>[] = useMemo(
    () => [
      {
        Header: i18n.table.secret,
        accessor: 'name',
        width: '33%',
        Cell: RenderColumnSecret
      },
      {
        Header: i18n.table.secretManager,
        accessor: 'secretManagerIdentifier',
        width: '33%',
        Cell: RenderColumnDetails
      },
      {
        Header: i18n.table.lastActivity,
        accessor: 'accountIdentifier', // temp value
        width: '30%',
        Cell: RenderColumnActivity
      },
      {
        Header: '',
        accessor: 'identifier',
        width: '4%',
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
          linkTo(routeSecretDetails, {
            secretId: secret.identifier
          })
        )
      }}
    />
  )
}

export default SecretsList
