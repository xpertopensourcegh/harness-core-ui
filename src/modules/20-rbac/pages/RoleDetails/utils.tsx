import type { ResourceType } from '@rbac/interfaces/ResourceType'
import type { Permission, PermissionResponse } from 'services/rbac'

export const getPermissionMap = (permissionList?: PermissionResponse[]): Map<ResourceType, Permission[]> => {
  const permissionsMap: Map<ResourceType, Permission[]> = new Map()
  permissionList?.map(response => {
    if (response.permission.resourceType) {
      if (permissionsMap.has(response.permission.resourceType)) {
        permissionsMap.get(response.permission.resourceType)?.push(response.permission)
      } else permissionsMap.set(response.permission.resourceType, [response.permission])
    }
  })
  return permissionsMap
}
