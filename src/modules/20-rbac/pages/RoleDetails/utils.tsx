import type { ResourceType } from '@rbac/interfaces/ResourceType'
import type { Permission, PermissionResponse } from 'services/rbac'

export const getPermissionMap = (permissionList?: PermissionResponse[]): Map<ResourceType, Permission[]> => {
  const permissionsMap: Map<ResourceType, Permission[]> = new Map()
  permissionList?.map(response => {
    if (response.permission.resourceType) {
      if (permissionsMap.has(response.permission.resourceType as ResourceType)) {
        permissionsMap.get(response.permission.resourceType as ResourceType)?.push(response.permission)
      } else permissionsMap.set(response.permission.resourceType as ResourceType, [response.permission])
    }
  })
  return permissionsMap
}
