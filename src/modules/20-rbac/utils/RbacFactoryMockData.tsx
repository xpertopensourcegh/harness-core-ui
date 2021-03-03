import React from 'react'
import type { ResourceHandler } from '@rbac/factories/RbacFactory'
import { ResourceType } from '@rbac/interfaces/ResourceType'

export const getResourceTypeHandlerMock = (resource: ResourceType): ResourceHandler | undefined => {
  switch (resource) {
    case ResourceType.PROJECT:
      return {
        icon: 'nav-project',
        label: 'Projects',
        // eslint-disable-next-line react/display-name
        addResourceModalBody: () => <></>
      }
    case ResourceType.ORGANIZATION:
      return {
        icon: 'nav-project',
        label: 'Organizations',
        // eslint-disable-next-line react/display-name
        addResourceModalBody: () => <></>
      }
    case ResourceType.SECRET:
      return {
        icon: 'lock',
        label: 'Secrets',
        // eslint-disable-next-line react/display-name
        addResourceModalBody: () => <></>
      }
  }
}
