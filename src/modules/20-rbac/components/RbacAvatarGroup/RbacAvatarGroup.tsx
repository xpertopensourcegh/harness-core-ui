import React from 'react'
import { AvatarGroup, AvatarGroupProps, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { usePermission, PermissionsRequest, PermissionRequest } from '@rbac/hooks/usePermission'

interface RbacAvatarGroupProps extends AvatarGroupProps {
  permission: PermissionRequest
}

const RbacAvatarGroup: React.FC<RbacAvatarGroupProps> = ({ permission: permissionRequest, ...restProps }) => {
  const { getString } = useStrings()

  const [canDoAction] = usePermission(
    {
      resourceScope: permissionRequest.resourceScope,
      resource: permissionRequest.resource,
      permissions: [permissionRequest.permission || '']
    } as PermissionsRequest,
    [permissionRequest]
  )

  return (
    <AvatarGroup
      {...restProps}
      onAddTooltip={canDoAction ? undefined : <Text padding="medium">{getString('noPermission')}</Text>}
      onAdd={event => {
        if (canDoAction) restProps.onAdd?.(event)
        else event.stopPropagation()
      }}
    />
  )
}

export default RbacAvatarGroup
