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

const RbacButton: React.FC<ButtonProps> = props => {
  const { getString } = useStrings()
  const [canDoAction] = usePermission({
    ...omit(props.permission, 'permission'),
    permissions: [props.permission.permission || '']
  })

  return (
    <CoreButton
      {...props}
      disabled={props.disabled || !canDoAction}
      tooltip={!canDoAction ? getString('noPermission') : undefined}
    />
  )
}

export default RbacButton
