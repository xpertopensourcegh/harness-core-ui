import React from 'react'
import { pick } from 'lodash-es'
import { Button as CoreButton, ButtonProps as CoreButtonProps } from '@wings-software/uicore'

import { PopoverInteractionKind } from '@blueprintjs/core'
import { usePermission, PermissionsRequest } from '@rbac/hooks/usePermission'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { useStrings } from 'framework/strings'

interface ButtonProps extends CoreButtonProps {
  permission: Omit<PermissionsRequest, 'permissions'> & { permission: PermissionIdentifier }
}

const RbacButton: React.FC<ButtonProps> = ({ permission: permissionRequest, ...restProps }) => {
  const { getString } = useStrings()
  const [canDoAction] = usePermission(
    {
      ...pick(permissionRequest, ['resourceScope', 'resource', 'options']),
      permissions: [permissionRequest.permission || '']
    } as PermissionsRequest,
    [permissionRequest]
  )

  return (
    <CoreButton
      {...restProps}
      disabled={restProps.disabled || !canDoAction}
      tooltip={!canDoAction ? getString('noPermission') : undefined}
      tooltipProps={{ hoverCloseDelay: 50, interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY }}
    />
  )
}

export default RbacButton
