import React from 'react'
import { omit } from 'lodash-es'
import { Button as CoreButton, ButtonProps as CoreButtonProps } from '@wings-software/uicore'

import type { PermissionCheck } from 'services/rbac'
import { usePermission } from '@rbac/hooks/usePermission'
import { useStrings } from 'framework/exports'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'

interface TypedPermissionCheck extends Omit<PermissionCheck, 'permission'> {
  permission: PermissionIdentifier
}

interface ButtonProps extends CoreButtonProps {
  permission: TypedPermissionCheck
}

const RbacButton: React.FC<ButtonProps> = ({ permission, ...restProps }) => {
  const { getString } = useStrings()
  const [canDoAction] = usePermission({
    ...omit(permission, 'permission'),
    permissions: [permission.permission || '']
  })

  return (
    <CoreButton
      {...restProps}
      disabled={restProps.disabled || !canDoAction}
      tooltip={!canDoAction ? getString('noPermission') : undefined}
    />
  )
}

export default RbacButton
