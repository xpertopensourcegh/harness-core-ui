import React, { useEffect, useState } from 'react'
import { Text, Layout, Container, Button, Color } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import produce from 'immer'
import type { ResourceGroupDetailsPathProps } from '@common/interfaces/RouteInterfaces'

import { useStrings } from 'framework/exports'
import ResourceTypeList from '@rbac/components/ResourceTypeList/ResourceTypeList'
import {
  useGetResourceGroup,
  useUpdateResourceGroup,
  ResourceGroupRequestRequestBody,
  ResourceGroupDTO
} from 'services/cd-ng'
import { Page } from '@common/components/Page/Page'
import { useToaster } from '@common/components/Toaster/useToaster'
import { RbacResourceGroupTypes } from '@rbac/constants/utils'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import ResourcesCard from '@rbac/components/ResourcesCard/ResourcesCard'
import { getResourceSelectorsfromMap, getSelectedResourcesMap } from './utils'
import css from './ResourceGroupDetails.module.scss'

const ResourceGroupDetails: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier, resourceGroupIdentifier } = useParams<
    ResourceGroupDetailsPathProps
  >()

  const { getString } = useStrings()
  const { data: resourceGroupDetails, error: errorInGettingResourceGroup, loading, refetch } = useGetResourceGroup({
    identifier: resourceGroupIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier
    }
  })
  const { showError, showSuccess } = useToaster()
  const [selectedResourcesMap, setSelectedResourceMap] = useState<Map<ResourceType, string[] | string>>(new Map())

  useEffect(() => {
    setSelectedResourceMap(getSelectedResourcesMap(resourceGroupDetails?.data?.resourceGroup.resourceSelectors))
  }, [resourceGroupDetails?.data?.resourceGroup])

  const { mutate: updateResourceGroup, loading: updating } = useUpdateResourceGroup({
    identifier: resourceGroupIdentifier || '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  const updateResourceGroupData = async (resourceGroup: ResourceGroupDTO): Promise<void> => {
    const dataToSubmit: ResourceGroupRequestRequestBody = {
      resourcegroup: {
        ...resourceGroup,
        resourceSelectors: getResourceSelectorsfromMap(selectedResourcesMap)
      }
    }
    try {
      const updated = await updateResourceGroup(dataToSubmit)
      if (updated) {
        showSuccess(getString('resourceGroup.updateSuccess'))
        refetch()
      }
    } /* istanbul ignore next */ catch (e) {
      showError(e.data?.message || e.message)
    }
  }

  const onResourceSelectionChange = (resourceType: ResourceType, isAdd: boolean, identifiers?: string[]): void => {
    if (identifiers) {
      if (isAdd) {
        setSelectedResourceMap(
          produce(selectedResourcesMap, draft => {
            draft.set(resourceType, identifiers)
          })
        )
      } else {
        setSelectedResourceMap(
          produce(selectedResourcesMap, draft => {
            const resources = draft.get(resourceType)
            if (resources && typeof resources === 'object')
              draft.set(
                resourceType,
                resources.filter(el => !identifiers.includes(el))
              )
            if (draft.get(resourceType)?.length === 0) draft.delete(resourceType)
          })
        )
      }
    } else {
      if (isAdd)
        setSelectedResourceMap(
          produce(selectedResourcesMap, draft => {
            draft.set(resourceType, RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR)
          })
        )
      else
        setSelectedResourceMap(
          produce(selectedResourcesMap, draft => {
            draft.delete(resourceType)
          })
        )
    }
  }

  if (errorInGettingResourceGroup) {
    return <Page.Error message={errorInGettingResourceGroup?.message} />
  }

  const resourceGroup = resourceGroupDetails?.data?.resourceGroup

  if (!resourceGroup)
    return <Page.NoDataCard icon="resources-icon" message={getString('resourceGroup.noResourceGroupFound')} />

  return (
    <>
      <Page.Header
        size="xlarge"
        className={css.headerContainer}
        title={
          <Layout.Vertical spacing="small">
            <Text font="medium" lineClamp={1} color={Color.BLACK}>
              {resourceGroup.name}
            </Text>
            <Text lineClamp={1} color={Color.GREY_400}>
              {resourceGroup.description}
            </Text>
          </Layout.Vertical>
        }
        toolbar={
          <Layout.Horizontal flex>
            <Layout.Vertical
              padding={{ right: 'small' }}
              border={{ right: true, color: Color.GREY_300 }}
              spacing="xsmall"
            >
              <Text>{getString('created')}</Text>
              <Text lineClamp={1} color={Color.BLACK}>
                {resourceGroup.harnessManaged && (
                  <Text lineClamp={1} color={Color.BLACK}>
                    {getString('resourceGroup.builtInResourceGroup')}
                  </Text>
                )}
                {!resourceGroup.harnessManaged && <ReactTimeago date={resourceGroupDetails?.data?.createdAt || ''} />}
              </Text>
            </Layout.Vertical>
            <Layout.Vertical spacing="xsmall" padding={{ left: 'small' }}>
              <Text>{getString('lastUpdated')}</Text>
              <Text lineClamp={1} color={Color.BLACK}>
                {resourceGroup.harnessManaged && (
                  <Text lineClamp={1} color={Color.BLACK}>
                    {getString('resourceGroup.builtInResourceGroup')}
                  </Text>
                )}
                {!resourceGroup.harnessManaged && (
                  <ReactTimeago date={resourceGroupDetails?.data?.lastModifiedAt || ''} />
                )}
              </Text>
            </Layout.Vertical>
          </Layout.Horizontal>
        }
      />
      <Page.Body loading={updating || loading}>
        <div className={css.pageContainer}>
          <Container
            padding="xlarge"
            className={css.resourceTypeListContainer}
            border={{ right: true, color: Color.GREY_250 }}
          >
            <ResourceTypeList
              onResourceSelectionChange={onResourceSelectionChange}
              preSelectedResourceList={Array.from(selectedResourcesMap.keys())}
              disableAddingResources={resourceGroup.harnessManaged}
            />
          </Container>
          <Container padding="xlarge">
            {!resourceGroup.harnessManaged && (
              <Layout.Vertical flex={{ alignItems: 'flex-end' }} padding="small">
                <Button onClick={() => updateResourceGroupData(resourceGroup)} disabled={updating}>
                  {getString('applyChanges')}
                </Button>
              </Layout.Vertical>
            )}
            <Layout.Vertical spacing="small" height="100%">
              {Array.from(selectedResourcesMap.keys()).map(resourceType => (
                <ResourcesCard
                  key={resourceType}
                  resourceType={resourceType}
                  resourceValues={selectedResourcesMap.get(resourceType)}
                  onResourceSelectionChange={onResourceSelectionChange}
                  disableAddingResources={resourceGroup.harnessManaged}
                />
              ))}
            </Layout.Vertical>
          </Container>
        </div>
      </Page.Body>
    </>
  )
}
export default ResourceGroupDetails
