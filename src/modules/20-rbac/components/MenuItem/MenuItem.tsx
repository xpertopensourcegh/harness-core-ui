import React from 'react'
import { IMenuItemProps, Menu, MenuItem, PopoverInteractionKind } from '@blueprintjs/core'
import { Container, Popover } from '@wings-software/uicore'
import { usePermission, PermissionsRequest, PermissionRequest } from '@rbac/hooks/usePermission'
import { String } from 'framework/strings'
import css from './MenuItem.module.scss'
interface MenuItemProps extends IMenuItemProps {
  permission: PermissionRequest
}

const RbacMenuItem: React.FC<MenuItemProps> = ({ permission: permissionRequest, ...restProps }) => {
  const [canDoAction] = usePermission(
    {
      resourceScope: permissionRequest.resourceScope,
      resource: permissionRequest.resource,
      permissions: [permissionRequest.permission || '']
    } as PermissionsRequest,
    [permissionRequest]
  )

  if (canDoAction) return <Menu.Item {...restProps} />
  return (
    <Popover
      fill
      usePortal
      interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
      hoverCloseDelay={50}
      content={
        <Container padding="small">
          <String stringID="noPermission" />
        </Container>
      }
      className={css.popover}
    >
      <div
        onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
          event.stopPropagation()
        }}
      >
        <MenuItem {...restProps} disabled />
      </div>
    </Popover>
  )
}

export default RbacMenuItem
