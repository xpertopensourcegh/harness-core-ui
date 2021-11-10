import React, { useState } from 'react'
import ReactTimeago from 'react-timeago'
import { set } from 'lodash-es'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Container, Text, Layout, Popover, Color, Card, useToaster } from '@wings-software/uicore'
import { Menu, MenuItem, Classes, Position } from '@blueprintjs/core'
import { useStrings } from 'framework/strings'
import { useDeleteDelegateGroupByIdentifier, DelegateGroupDetails } from 'services/portal'
import { useConfirmationDialog } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { TagsViewer } from '@common/components/TagsViewer/TagsViewer'
import { delegateTypeToIcon } from '@common/utils/delegateUtils'
import RbacMenuItem from '@rbac/components/MenuItem/MenuItem'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { usePermission } from '@rbac/hooks/usePermission'

import css from './DelegatesPage.module.scss'

type delTroubleshoterProps = {
  delegate: DelegateGroupDetails
  setOpenTroubleshoter: (prop: { isConnected: boolean | undefined }) => void
}

const columnWidths = {
  icon: '38px',
  name: '30%',
  tags: '25%',
  heartbeat: 'calc(20% - 18px)',
  status: 'calc(20% - 20px)',
  actions: '5%'
}

export const DelegateListingHeader = () => {
  const { getString } = useStrings()
  return (
    <Layout.Horizontal className={css.delegateListHeader}>
      <div key="icon" style={{ width: columnWidths.icon }}></div>
      <div key="del-name" style={{ width: columnWidths.name }}>
        {getString('delegate.DelegateName')}
      </div>
      <div key="tags" style={{ width: columnWidths.tags }}>
        {getString('tagsLabel')}
      </div>
      <div key="heartbeat" style={{ width: columnWidths.heartbeat }}>
        {getString('delegate.LastHeartBeat')}
      </div>
      <div key="status" style={{ width: columnWidths.status }}>
        {getString('connectivityStatus')}
      </div>
      <div key="actions" style={{ width: columnWidths.actions }} />
    </Layout.Horizontal>
  )
}

const RenderColumnMenu = ({ delegate, setOpenTroubleshoter }: delTroubleshoterProps) => {
  const { delegateGroupIdentifier, groupName, activelyConnected } = delegate
  const { getString } = useStrings()
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<Record<string, string>>()

  const { mutate: forceDeleteDelegate } = useDeleteDelegateGroupByIdentifier({
    queryParams: { accountId: accountId, orgId: orgIdentifier, projectId: projectIdentifier }
  })

  const forceDeleteDialog = useConfirmationDialog({
    contentText: `${getString('delegates.questionForceDeleteDelegate')} ${groupName}`,
    titleText: getString('delegate.deleteDelegate'),
    confirmButtonText: getString('delete'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          if (delegateGroupIdentifier) {
            const deleted = await forceDeleteDelegate(delegateGroupIdentifier)

            if (deleted) {
              showSuccess(getString('delegates.delegateDeleted', { name: groupName }))
            }
          }
        } catch (error) {
          showError(error.data.responseMessages[0].message || error.message)
        }
      }
    }
  })

  const handleForceDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.stopPropagation()
    setMenuOpen(false)
    forceDeleteDialog.openDialog()
  }

  return (
    <Layout.Horizontal className={css.itemActionContainer}>
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
          icon="Options"
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu style={{ minWidth: 'unset' }}>
          <RbacMenuItem
            permission={{
              resourceScope: {
                accountIdentifier: accountId,
                orgIdentifier,
                projectIdentifier
              },
              resource: {
                resourceType: ResourceType.DELEGATE,
                resourceIdentifier: delegateGroupIdentifier
              },
              permission: PermissionIdentifier.VIEW_DELEGATE
            }}
            icon="edit"
            text={getString('details')}
          />
          <RbacMenuItem
            permission={{
              resourceScope: {
                accountIdentifier: accountId,
                orgIdentifier,
                projectIdentifier
              },
              resource: {
                resourceType: ResourceType.DELEGATE,
                resourceIdentifier: delegateGroupIdentifier
              },
              permission: PermissionIdentifier.DELETE_DELEGATE
            }}
            icon="trash"
            text={getString('delete')}
            onClick={handleForceDelete}
          />
          {delegate.delegateType === 'KUBERNETES' && (
            <MenuItem
              text={getString('delegates.openTroubleshooter')}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                setOpenTroubleshoter({ isConnected: activelyConnected })
              }}
              icon="book"
            />
          )}
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

export const DelegateListingItem = ({ delegate, setOpenTroubleshoter }: delTroubleshoterProps) => {
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier, module } = useParams<Record<string, string>>()
  const history = useHistory()

  const [canAccessDelegate] = usePermission(
    {
      resourceScope: {
        accountIdentifier: accountId,
        orgIdentifier,
        projectIdentifier
      },
      resource: {
        resourceType: ResourceType.DELEGATE
      },
      permissions: [PermissionIdentifier.VIEW_DELEGATE]
    },
    []
  )

  const onDelegateClick = (): void => {
    if (canAccessDelegate) {
      const params = {
        accountId,
        delegateIdentifier: delegate.delegateGroupIdentifier as string
      }
      if (orgIdentifier) {
        set(params, 'orgIdentifier', orgIdentifier)
      }
      if (projectIdentifier) {
        set(params, 'projectIdentifier', projectIdentifier)
      }
      if (module) {
        set(params, 'module', module)
      }
      history.push(routes.toDelegatesDetails(params))
    }
  }

  const isConnected = delegate.activelyConnected
  const text = isConnected ? getString('connected') : getString('delegate.notConnected')
  const color: Color = isConnected ? Color.GREEN_600 : Color.GREY_400
  const allSelectors = Object.keys(delegate.groupImplicitSelectors || {})

  return (
    <Card elevation={2} interactive={true} onClick={onDelegateClick} className={css.delegateItemContainer}>
      <Layout.Horizontal className={css.delegateItemSubcontainer}>
        <Text
          width={columnWidths.icon}
          icon={delegateTypeToIcon(delegate.delegateType as string)}
          iconProps={{ size: 24 }}
        />
        <Layout.Horizontal width={columnWidths.name} data-testid={delegate.groupHostName}>
          <Layout.Vertical padding={{ left: 'small' }}>
            <Layout.Horizontal spacing="small" data-testid={delegate.groupName}>
              <Text color={Color.BLACK}>{delegate.groupName}</Text>
            </Layout.Horizontal>
            <div className={css.groupHostName}>{delegate.groupHostName}</div>
          </Layout.Vertical>
        </Layout.Horizontal>

        <Container className={css.connectivity} width={columnWidths.tags}>
          {delegate.groupImplicitSelectors && (
            <>
              <TagsViewer key="tags" tags={allSelectors.slice(0, 3)} />
              <span key="hidenTags">{allSelectors.length > 3 ? '+' + (allSelectors.length - 3) : ''}</span>
            </>
          )}
        </Container>

        <Layout.Horizontal width={columnWidths.heartbeat}>
          {delegate.lastHeartBeat ? <ReactTimeago date={delegate.lastHeartBeat} live /> : getString('na')}
        </Layout.Horizontal>

        <Layout.Vertical width={columnWidths.status}>
          <Text icon="full-circle" iconProps={{ size: 6, color, padding: 'small' }}>
            {text}
          </Text>
          {!isConnected && delegate.delegateType === 'KUBERNETES' && (
            <div
              className={css.troubleshootLink}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setOpenTroubleshoter({ isConnected })
              }}
            >
              {getString('delegates.troubleshootOption')}
            </div>
          )}
        </Layout.Vertical>

        <Layout.Vertical width={columnWidths.actions}>
          {RenderColumnMenu({ delegate, setOpenTroubleshoter })}
        </Layout.Vertical>
      </Layout.Horizontal>
    </Card>
  )
}
export default DelegateListingItem
