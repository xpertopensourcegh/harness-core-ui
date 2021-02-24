import { useEffect } from 'react'
import { omit } from 'lodash-es'

import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { usePermissionsContext } from '@rbac/interfaces/PermissionsContext'
import type { Permission, PermissionCheck } from 'services/rbac'

interface PermissionsRequest extends Omit<PermissionCheck, 'permission'> {
  actions: string[]
}

const allowedStatuses = ['ACTIVE', 'EXPERIMENTAL']

const getPermissionIdentifierFromAction = (
  permissions: Permission[] = [],
  resourceType = '',
  action = ''
): string | undefined => {
  // TODO: check allowedScopeLevels also
  return permissions?.find(
    perm =>
      perm.action === action &&
      // TODO: remove `toUpperCase` when BE fixes resourceType case
      perm.resourceType?.toUpperCase() === resourceType &&
      allowedStatuses.includes(perm.status)
  )?.identifier
}

export function usePermission(permissionsRequest: PermissionsRequest, deps: Array<any> = []): Array<boolean> {
  const { permissions } = useAppStore()
  const { requestPermission, checkPermission, cancelRequest } = usePermissionsContext()

  useEffect(() => {
    // generate PermissionRequest for every action user requested
    permissionsRequest.actions.forEach(action => {
      const permissionIdentifier = getPermissionIdentifierFromAction(
        permissions,
        permissionsRequest.resourceType,
        action
      )
      if (permissionIdentifier) {
        // register request in the context
        requestPermission({
          ...omit(permissionsRequest, 'actions'),
          permission: permissionIdentifier
        } as PermissionCheck)
      } else {
        __DEV__ &&
          // eslint-disable-next-line no-console
          console.warn('RBAC: No permission found for request', {
            resourceType: permissionsRequest.resourceType,
            action
          })
      }
    })

    return () => {
      // cancel above request when this hook instance is unmounting
      permissionsRequest.actions.forEach(action => {
        const permissionIdentifier = getPermissionIdentifierFromAction(
          permissions,
          permissionsRequest.resourceType,
          action
        )
        if (permissionIdentifier) {
          cancelRequest({
            ...omit(permissionsRequest, 'actions'),
            permission: permissionIdentifier
          } as PermissionCheck)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  // hook should return boolean for every action requested, in same order
  return permissionsRequest.actions.map(action =>
    checkPermission({
      ...omit(permissionsRequest, 'actions'),
      permission: getPermissionIdentifierFromAction(permissions, permissionsRequest.resourceType, action)
    } as PermissionCheck)
  )
}
