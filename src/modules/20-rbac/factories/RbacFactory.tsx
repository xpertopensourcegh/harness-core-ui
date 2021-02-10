import type React from 'react'
import type { IconName } from '@wings-software/uicore'

export enum ResourceType { // TODO: this should come from backend?
  Secret = 'Secret',
  Project = 'Project'
}

export interface ResourceHandler {
  icon: IconName
  label: string
  addResourceModalBody: React.ReactElement
}

class RbacFactory {
  private map: Map<ResourceType, ResourceHandler>

  constructor() {
    this.map = new Map()
  }

  registerResourceTypeHandler(resourceType: ResourceType, handler: ResourceHandler): void {
    this.map.set(resourceType, handler)
  }

  getResourceTypeHandler(resourceType: ResourceType): ResourceHandler | undefined {
    return this.map.get(resourceType)
  }
}

export default new RbacFactory()
