import React from 'react'
import { Layout, Text, Button } from '@wings-software/uicore'
import { noop } from 'lodash-es'
import { useStrings } from 'framework/exports'

import RbacFactory, { ResourceType } from '@rbac/factories/RbacFactory'
import useAddResourceModal from '@rbac/modals/AddResourceModal/useAddResourceModal'

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

  if (!resourceHandler) return null

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
      type: ResourceType.Project,
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
