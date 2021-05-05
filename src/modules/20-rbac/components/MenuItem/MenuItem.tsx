import React from 'react'

import { IMenuItemProps, Menu, Tooltip } from '@blueprintjs/core'
import { usePermission, PermissionsRequest, PermissionRequest } from '@rbac/hooks/usePermission'
import { String } from 'framework/strings'

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

  if (canDoAction) return <Menu.Item {...restProps} disabled={restProps.disabled} />
  return (
    <Tooltip content={<String stringID="noPermission" />}>
      <Menu.Item {...restProps} disabled />
    </Tooltip>
  )
}

export default RbacMenuItem
