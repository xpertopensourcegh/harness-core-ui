import React, { useMemo, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { Menu, Position, Classes } from '@blueprintjs/core'
import type { Column, Renderer, CellProps } from 'react-table'

import { Text, Color, Layout, Icon, Button, TextInput, SelectV2, Popover, Container } from '@wings-software/uikit'
import Table from 'modules/common/components/Table/Table'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { useListSecrets, ResponseDTOListEncryptedDataDTO, useDeleteSecretText } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'
import useCreateSecretModal, { SecretType } from 'modules/dx/modals/CreateSecretModal/useCreateSecretModal'
import { linkTo } from 'framework/exports'
import { PageError } from 'modules/common/components/Page/PageError'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import { routeSecretDetails } from '../../routes'

import i18n from './SecretsList.i18n'
import css from './SecretsList.module.scss'

const getStringForType = (type?: string): string => {
  if (!type) return ''
  switch (type) {
    case 'SECRET_TEXT':
      return 'Text'
    case 'CONFIG_FILE':
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
      <div>
        <Text color={Color.BLACK}>{data.name}</Text>
        <Text color={Color.GREY_400}>{data.identifier}</Text>
      </div>
    </Layout.Horizontal>
  )
}

const RenderColumnDetails: Renderer<CellProps<EncryptedDataDTO>> = ({ row }) => {
  const data = row.original
  return (
    <>
      <Text color={Color.BLACK}>{data.secretManagerIdentifier}</Text>
      <Text color={Color.GREY_400}>{getStringForType('SECRET_TEXT')}</Text>
    </>
  )
}

const RenderColumnActivity: Renderer<CellProps<EncryptedDataDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {data.lastUpdatedAt ? <ReactTimeago date={data.lastUpdatedAt} /> : null}
      {/* <Text>4 hours ago</Text> */}
    </Layout.Horizontal>
  )
}

const RenderColumnAction: Renderer<CellProps<EncryptedDataDTO>> = ({ row, column }) => {
  const data = row.original
  const { accountId } = useParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const { mutate: deleteSecret } = useDeleteSecretText({
    queryParams: { accountIdentifier: accountId },
    requestOptions: { headers: { 'content-type': 'application/json' } }
  })

  const handleDelete = async (e: React.MouseEvent<HTMLElement, MouseEvent>): Promise<void> => {
    e.stopPropagation()
    setMenuOpen(false)
    const sure = confirm(i18n.confirmDelete(data.name || ''))
    if (sure && data.identifier) {
      try {
        await deleteSecret(data.identifier)
        ;(column as any).refreshSecrets?.()
      } catch (err) {
        // handle error
      }
    }
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
        icon="menu"
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
  mockData?: UseGetMockData<ResponseDTOListEncryptedDataDTO>
}

const SecretsList: React.FC<SecretsListProps> = ({ mockData }) => {
  const { accountId } = useParams()
  const history = useHistory()

  const { data: secretsResponse, loading, error, refetch } = useListSecrets({
    queryParams: { accountIdentifier: accountId, type: 'SECRET_TEXT' },
    mock: mockData
  })
  const { openCreateSecretModal } = useCreateSecretModal({
    onSuccess: () => {
      refetch()
    }
  })

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
        refreshSecrets: refetch
      }
    ],
    [refetch]
  )

  // TODO: remove `any` once backend fixes the type
  const data: EncryptedDataDTO[] = useMemo(() => (secretsResponse?.data as any)?.response || [], [
    secretsResponse?.data
  ])

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />

  return (
    <div>
      <Layout.Horizontal flex className={css.header}>
        <Popover minimal position={Position.BOTTOM_LEFT}>
          <Button intent="primary" text={i18n.newSecret.button} icon="plus" rightIcon="chevron-down" />
          <Menu large>
            <Menu.Item
              text={i18n.newSecret.text}
              labelElement={<Icon name="font" />}
              onClick={() => openCreateSecretModal(SecretType.TEXT)}
            />
            <Menu.Item
              text={i18n.newSecret.file}
              labelElement={<Icon name="document" />}
              onClick={() => openCreateSecretModal(SecretType.FILE)}
            />
            <Menu.Divider />
            <Menu.Item text={i18n.newSecret.yaml} />
          </Menu>
        </Popover>
        <Layout.Horizontal spacing="small">
          <TextInput leftIcon="search" placeholder="Search" />
          <span>
            <SelectV2 items={[]} filterable={false} disabled>
              <Button text="Select Saved Filter" rightIcon="chevron-down" disabled />
            </SelectV2>
          </span>
        </Layout.Horizontal>
      </Layout.Horizontal>
      {data.length > 0 ? (
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
      ) : (
        <Container width="100%" height="100%" flex={{ align: 'center-center' }} padding="xlarge">
          There are no secrets
        </Container>
      )}
    </div>
  )
}

export default SecretsList
