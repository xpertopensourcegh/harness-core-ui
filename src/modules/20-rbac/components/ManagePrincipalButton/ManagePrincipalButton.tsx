import React from 'react'

import { useParams } from 'react-router-dom'
import type { ButtonProps } from '@wings-software/uicore'
import RbacButton from '@rbac/components/Button/Button'
import type { PermissionRequest } from '@rbac/hooks/usePermission'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'

interface ManagePrincipalButton extends ButtonProps {
  resourceIdentifier?: string
  resourceType: ResourceType.USERGROUP | ResourceType.USER
}

const ManagePrincipalButton: React.FC<ManagePrincipalButton> = ({ resourceIdentifier, resourceType, ...restProps }) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()

  const permission: PermissionRequest = {
    resourceScope: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    },
    resource: {
      resourceType,
      resourceIdentifier
    },
    permission:
      resourceType === ResourceType.USER ? PermissionIdentifier.MANAGE_USER : PermissionIdentifier.MANAGE_USERGROUP
  }

  return <RbacButton {...restProps} permission={permission} />
}

export default ManagePrincipalButton
