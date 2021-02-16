import React from 'react'
import { Layout, Text, Button } from '@wings-software/uicore'
import { noop } from 'lodash-es'
import { useStrings } from 'framework/exports'

import RbacFactory from '@rbac/factories/RbacFactory'
import useAddResourceModal from '@rbac/modals/AddResourceModal/useAddResourceModal'
import type { ResourceType } from '@rbac/interfaces/ResourceType'

// TODO: we should get this from BE
interface Resource {
  type: ResourceType
  id: number
}

interface ResourceTypeListItemProps {
  resource: Resource
}

const ResourceTypeListItem: React.FC<ResourceTypeListItemProps> = ({ resource }) => {
  const resourceHandler = RbacFactory.getResourceTypeHandler(resource.type)
  const { openAddResourceModal } = useAddResourceModal({ onSuccess: noop })

  if (!resourceHandler) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn('[RBAC] No resource handler registered for type: ', resource.type)
    return null
  }

  return (
    <Layout.Horizontal>
      <Text icon={resourceHandler.icon}>{resourceHandler.label}</Text>
      <Button icon="plus" onClick={() => openAddResourceModal(resourceHandler)}>
        Add {resourceHandler.label}
      </Button>
    </Layout.Horizontal>
  )
}

const ResourceGroups: React.FC = () => {
  const { getString } = useStrings()
  // TODO: this will come from BE response
  const resources: Resource[] = [
    {
      type: 'PROJECT',
      id: 1
    }
  ]

  return (
    <Layout.Vertical flex>
      <Text>{getString('tbd')}</Text>
      {resources.map(resource => (
        <ResourceTypeListItem key={resource.id} resource={resource} />
      ))}
    </Layout.Vertical>
  )
}

export default ResourceGroups
