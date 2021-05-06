import React from 'react'
import { pick } from 'lodash-es'

import { AvatarGroup, AvatarGroupProps, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { usePermission, PermissionsRequest } from '@rbac/hooks/usePermission'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'

interface RbacAvatarGroupProps extends AvatarGroupProps {
  permission: Omit<PermissionsRequest, 'permissions'> & { permission: PermissionIdentifier }
}

const RbacAvatarGroup: React.FC<RbacAvatarGroupProps> = ({ permission: permissionRequest, ...restProps }) => {
  const { getString } = useStrings()

  const [canDoAction] = usePermission(
    {
      ...pick(permissionRequest, ['resourceScope', 'resource', 'options']),
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
