import { identity, pick, pickBy } from 'lodash-es'

import { useParams } from 'react-router'
import { useDeepCompareEffect } from '@common/hooks'
import { usePermissionsContext, PermissionRequestOptions } from '@rbac/interfaces/PermissionsContext'
import type { PermissionCheck, ResourceScope } from 'services/rbac'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'

export interface Resource {
  resourceType: ResourceType
  resourceIdentifier?: string
}

export interface PermissionRequest {
  resourceScope?: ResourceScope
  resource: Resource
  permission: PermissionIdentifier
}

export interface PermissionsRequest {
  resourceScope?: ResourceScope
  resource: Resource
  permissions: PermissionIdentifier[]
  options?: PermissionRequestOptions
}

export function getDTOFromRequest(permissionRequest: PermissionRequest, defaultScope: ResourceScope): PermissionCheck {
  const { resource, resourceScope, permission } = permissionRequest
  return {
    // pickBy(obj, identity) removes keys with undefined values
    resourceScope: pickBy(resourceScope || defaultScope, identity),
    ...pickBy(resource, identity),
    permission
  }
}

export function usePermission(permissionsRequest: PermissionsRequest, deps: Array<any> = []): Array<boolean> {
  const { NG_RBAC_ENABLED } = useFeatureFlags()
  const { requestPermission, checkPermission, cancelRequest } = usePermissionsContext()
  const { accountId: accountIdentifier, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const defaultScope = { accountIdentifier, orgIdentifier, projectIdentifier }
  const { options } = permissionsRequest

  useDeepCompareEffect(() => {
    if (NG_RBAC_ENABLED) {
      // generate PermissionRequest for every action user requested
      permissionsRequest.permissions.forEach(permission => {
        const permissionCheckDto = getDTOFromRequest(
          {
            permission,
            ...pick(permissionsRequest, ['resourceScope', 'resource'])
          } as PermissionRequest,
          defaultScope
        )
        // register request in the context
        requestPermission(permissionCheckDto, options)
      })
    }

    return () => {
      if (NG_RBAC_ENABLED) {
        // cancel above request when this hook instance is unmounting
        permissionsRequest.permissions.forEach(permission => {
          const permissionCheckDto = getDTOFromRequest(
            {
              permission,
              ...pick(permissionsRequest, ['resourceScope', 'resource'])
            } as PermissionRequest,
            defaultScope
          )
          cancelRequest(permissionCheckDto)
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NG_RBAC_ENABLED, options, ...deps])

  // hook should return boolean for every action requested, in same order
  return permissionsRequest.permissions.map(permission => {
    const permissionCheckDto = getDTOFromRequest(
      {
        permission,
        ...pick(permissionsRequest, ['resourceScope', 'resource'])
      } as PermissionRequest,
      defaultScope
    )
    return NG_RBAC_ENABLED ? checkPermission(permissionCheckDto) : true
  })
}
