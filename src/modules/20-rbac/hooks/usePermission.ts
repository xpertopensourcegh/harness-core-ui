import { useEffect } from 'react'
import { omit } from 'lodash-es'

import { usePermissionsContext, PermissionRequestOptions } from '@rbac/interfaces/PermissionsContext'
import type { PermissionCheck } from 'services/rbac'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'

interface PermissionsRequest extends Omit<PermissionCheck, 'permission'> {
  permissions: PermissionIdentifier[]
  options?: PermissionRequestOptions
}

export function usePermission(permissionsRequest: PermissionsRequest, deps: Array<any> = []): Array<boolean> {
  const { NG_RBAC_ENABLED } = useFeatureFlags()
  const { requestPermission, checkPermission, cancelRequest } = usePermissionsContext()
  const { options } = permissionsRequest

  useEffect(() => {
    if (NG_RBAC_ENABLED) {
      // generate PermissionRequest for every action user requested
      permissionsRequest.permissions.forEach(permissionIdentifier => {
        // register request in the context
        requestPermission(
          {
            ...omit(permissionsRequest, ['permissions', 'options']),
            permission: permissionIdentifier
          } as PermissionCheck,
          options
        )
      })
    }

    return () => {
      if (NG_RBAC_ENABLED) {
        // cancel above request when this hook instance is unmounting
        permissionsRequest.permissions.forEach(permissionIdentifier => {
          cancelRequest({
            ...omit(permissionsRequest, 'permissions'),
            permission: permissionIdentifier
          } as PermissionCheck)
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  // hook should return boolean for every action requested, in same order
  return permissionsRequest.permissions.map(permission =>
    NG_RBAC_ENABLED
      ? checkPermission({
          ...omit(permissionsRequest, 'permissions'),
          permission
        } as PermissionCheck)
      : true
  )
}
