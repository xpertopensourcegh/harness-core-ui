import { RbacResourceGroupTypes } from '@rbac/constants/utils'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import type { ResourceSelector } from 'services/cd-ng'

export const getSelectedResourcesMap = (
  resourceSelectorList?: ResourceSelector[]
): Map<ResourceType, string[] | string> => {
  const map: Map<ResourceType, string[] | string> = new Map()

  resourceSelectorList?.map(resourceSelector => {
    if (resourceSelector.type === RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR)
      map.set(resourceSelector.resourceType, RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR)
    else {
      if (map.has(resourceSelector.resourceType)) {
        const resources = map.get(resourceSelector.resourceType)
        if (typeof resources === 'string') map.set(resourceSelector.resourceType, [resourceSelector.identifier])
        else if (resources) map.set(resourceSelector.resourceType, [...resources, resourceSelector.identifier])
      }
    }
  })

  return map
}

export const getResourceSelectorsfromMap = (map: Map<ResourceType, string[] | string>): ResourceSelector[] => {
  const resourceSelectors: ResourceSelector[] = []
  map.forEach((value, key) => {
    if (value === RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR)
      resourceSelectors.push({
        type: RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR,
        resourceType: key
      })
    else {
      resourceSelectors.push({
        type: RbacResourceGroupTypes.STATIC_RESOURCE_SELECTOR,
        resourceType: key,
        identifiers: value
      })
    }
  })
  return resourceSelectors
}
