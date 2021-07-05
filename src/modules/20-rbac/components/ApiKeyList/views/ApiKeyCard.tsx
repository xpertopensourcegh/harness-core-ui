import React, { useState } from 'react'
import { Button, Card, Collapse, Color, Container, Intent, Layout, Popover, Text } from '@wings-software/uicore'
import ReactTimeago from 'react-timeago'
import { Classes, Menu, Position, MenuItem } from '@blueprintjs/core'
import { ApiKeyAggregateDTO, ApiKeyDTO, TokenDTO, useDeleteApiKey } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import { TagsPopover, useToaster } from '@common/components'
import TokenList from '@rbac/components/TokenList/TokenList'
import { useConfirmationDialog } from '@common/exports'
import { useApiKeyModal } from '@rbac/modals/ApiKeyModal/useApiKeyModal'
import css from '../ApiKeyList.module.scss'

interface ApiKeyCardProps {
  data: ApiKeyAggregateDTO
  openTokenModal: (apiKeyIdentifier: string, token?: TokenDTO, _isRotate?: boolean) => void
  refetchApiKeys: () => void
  onRefetchComplete: () => void
  refetchTokens: boolean
}

const RenderColumnDetails = (data: ApiKeyDTO): React.ReactElement => {
  const { getString } = useStrings()
  return (
    <div>
      <Layout.Horizontal spacing="small">
        <Text color={Color.BLACK} lineClamp={1} className={css.wordBreak}>
          {data.name}
        </Text>
        {data.tags && Object.keys(data.tags).length ? <TagsPopover tags={data.tags} /> : null}
      </Layout.Horizontal>
      <Text color={Color.GREY_400} lineClamp={1} font={{ size: 'small' }} className={css.wordBreak}>
        {getString('idLabel', { id: data.identifier })}
      </Text>
    </div>
  )
}

const RenderColumnMenu: React.FC<{ data: ApiKeyDTO; reload: () => void }> = ({ data, reload }) => {
  const { accountIdentifier, orgIdentifier, projectIdentifier, identifier, parentIdentifier } = data
  const [menuOpen, setMenuOpen] = useState(false)
  const { getString } = useStrings()
  const { showSuccess, showError } = useToaster()
  const { mutate: deleteApiKey } = useDeleteApiKey({
    queryParams: {
      accountIdentifier: accountIdentifier || '',
      orgIdentifier,
      projectIdentifier,
      apiKeyType: 'SERVICE_ACCOUNT',
      parentIdentifier: parentIdentifier || ''
    }
  })

  const { openApiKeyModal } = useApiKeyModal({ onSuccess: reload })

  const { openDialog: openDeleteDialog } = useConfirmationDialog({
    contentText: getString('rbac.apiKey.confirmDelete', { name: data.name }),
    titleText: getString('rbac.apiKey.confirmDeleteTitle'),
    confirmButtonText: getString('delete'),
    cancelButtonText: getString('cancel'),
    intent: Intent.WARNING,
    onCloseDialog: async (isConfirmed: boolean) => {
      /* istanbul ignore else */ if (isConfirmed) {
        try {
          const deleted = await deleteApiKey(identifier || '', {
            headers: { 'content-type': 'application/json' }
          })
          /* istanbul ignore else */ if (deleted) {
            showSuccess(getString('rbac.apiKey.successMessage', { name: data.name }))
            reload()
          } else {
            showError(getString('deleteError'))
          }
        } catch (err) {
          /* istanbul ignore next */
          showError(err?.data?.message || err?.message)
        }
      }
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    openDeleteDialog()
  }

  const handleEdit = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    openApiKeyModal(data)
  }

  return (
    <Layout.Horizontal flex={{ justifyContent: 'flex-end' }}>
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
          icon="Options"
          data-testid={`menu-${data.identifier}`}
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu>
          <MenuItem icon="edit" text={getString('edit')} onClick={handleEdit} />
          <MenuItem icon="trash" text={getString('delete')} onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({
  data,
  openTokenModal,
  refetchApiKeys,
  onRefetchComplete,
  refetchTokens
}) => {
  const { apiKey, createdAt, lastModifiedAt, tokensCount } = data
  const { getString } = useStrings()
  return (
    <Card key={apiKey.identifier} className={css.card}>
      <div className={css.apiKeyList}>
        <RenderColumnDetails {...apiKey} />
        <Text>
          {`${getString('created')} `}
          <ReactTimeago date={createdAt} />
        </Text>
        <Text>
          {`${getString('common.lastModifiedTime')} `}
          <ReactTimeago date={lastModifiedAt} />
        </Text>
        <RenderColumnMenu data={apiKey} reload={refetchApiKeys} />
      </div>
      <Container padding={{ top: 'small' }}>
        {tokensCount ? (
          <Collapse
            collapsedIcon="chevron-right"
            expandedIcon="chevron-up"
            isRemovable={false}
            collapseClassName={css.collapse}
            // heading={`${getString('common.tokens')} (${tokensCount})`}
            heading={
              <div>
                <Text> {`${getString('common.tokens')} (${tokensCount})`}</Text>
              </div>
            }
          >
            <TokenList
              apiKeyIdentifier={apiKey.identifier}
              openTokenModal={openTokenModal}
              reloadApiKey={refetchApiKeys}
              refetchTokens={refetchTokens}
              onRefetchComplete={onRefetchComplete}
            />
            <Button
              text={getString('plusNumber', { number: getString('token') })}
              minimal
              margin={{ top: 'medium' }}
              intent="primary"
              className={css.noPadding}
              onClick={() => openTokenModal(apiKey.identifier)}
            />
          </Collapse>
        ) : (
          <Button
            text={getString('plusNumber', { number: getString('token') })}
            minimal
            intent="primary"
            className={css.noPadding}
            onClick={() => openTokenModal(apiKey.identifier)}
          />
        )}
      </Container>
    </Card>
  )
}

export default ApiKeyCard
