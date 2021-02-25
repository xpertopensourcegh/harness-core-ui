import React, { useState, useEffect } from 'react'
import { Text, Layout, Container, Button, Color } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import ReactTimeago from 'react-timeago'
import { get } from 'lodash-es'
import type { ResourceGroupDetailsPathProps } from '@common/interfaces/RouteInterfaces'

import SelectedResourceTypeDetailsList from '@rbac/components/SelectedResourceTypeDetailsList/SelectedResourceTypeDetailsList'
import { useStrings } from 'framework/exports'
import ResourceTypeList from '@rbac/components/ResourceTypeList/ResourceTypeList'
import { useGetResourceGroup, useUpdateResourceGroup, ResourceGroupRequestRequestBody } from 'services/cd-ng'
import { Page } from '@common/components/Page/Page'
import { useToaster } from '@common/components/Toaster/useToaster'
import { RbacResourceGroupTypes } from '@rbac/constants/utils'
import { ResourceGroup, ResourceGroupSelection, ResourceType } from '@rbac/interfaces/ResourceType'
import css from './ResourceGroupDetails.module.scss'

const getSelectedResourceTypes = (selectedResourceGroup: ResourceGroup) => {
  return Object.keys(selectedResourceGroup).reduce((returnList: ResourceGroup[], resourceName) => {
    if (get(selectedResourceGroup, resourceName)) {
      returnList.push({
        type: RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR,
        resourceType: resourceName
      })
    }
    return returnList
  }, [])
}
const getSelectedResourceTypesStrings = (selectedResourceGroup: ResourceGroup) => {
  return Object.keys(selectedResourceGroup).reduce((returnList: ResourceType[], resourceName) => {
    if (get(selectedResourceGroup, resourceName)) {
      if (resourceName in ResourceType) {
        returnList.push(resourceName as ResourceType)
      }
    }
    return returnList
  }, [])
}
const ResourceGroupDetails: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier, resourceGroupIdentifier } = useParams<
    ResourceGroupDetailsPathProps
  >()

  const { getString } = useStrings()
  const { data: resourceGroupDetails, error: errorInGettingResourceGroup, loading } = useGetResourceGroup({
    identifier: resourceGroupIdentifier,
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier
    }
  })
  const { showError, showSuccess } = useToaster()

  const [selectedResourceGroup, setSelectedResourceGroup] = useState({})
  useEffect(() => {
    const tempSelectedResorceGroup = resourceGroupDetails?.data?.resourceGroup.resourceSelectors.length
      ? resourceGroupDetails?.data?.resourceGroup?.resourceSelectors?.reduce((returnList, resource) => {
          if (get(resource, 'type') === RbacResourceGroupTypes.DYNAMIC_RESOURCE_SELECTOR) {
            returnList[get(resource, 'resourceType')] = true
          }
          return returnList
        }, {})
      : {}
    setSelectedResourceGroup(tempSelectedResorceGroup)
  }, [resourceGroupDetails?.data?.resourceGroup?.resourceSelectors])

  const { mutate: updateResourceGroup, loading: updating } = useUpdateResourceGroup({
    identifier: resourceGroupIdentifier || '',
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  const updateResourceGroupData = async () => {
    const tempResourceGrpDtls = resourceGroupDetails?.data?.resourceGroup
    if (tempResourceGrpDtls) {
      const dataToSubmit: ResourceGroupRequestRequestBody = {
        resourcegroup: {
          ...tempResourceGrpDtls,
          resourceSelectors: getSelectedResourceTypes(selectedResourceGroup)
        }
      }
      try {
        const updated = await updateResourceGroup(dataToSubmit)
        if (updated) {
          showSuccess(getString('resourceGroup.updateSuccess'))
        }
      } /* istanbul ignore next */ catch (e) {
        showError(e.data?.message || e.message)
      }
    }
  }

  const onResourceTypeChanged = (resourceType: ResourceGroupSelection) => {
    setSelectedResourceGroup(res => {
      return { ...res, ...resourceType }
    })
  }

  if (errorInGettingResourceGroup) {
    return <Page.Error message={errorInGettingResourceGroup?.message} />
  }
  return resourceGroupDetails?.data?.resourceGroup ? (
    <>
      <Page.Header
        size="xlarge"
        className={css.headerContainer}
        title={
          <Layout.Vertical spacing="small">
            <Text font="medium" lineClamp={1} color={Color.BLACK}>
              {resourceGroupDetails?.data?.resourceGroup?.name}
            </Text>
            <Text lineClamp={1} color={Color.GREY_400}>
              {resourceGroupDetails?.data?.resourceGroup?.description}
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
                {resourceGroupDetails?.data?.resourceGroup?.harnessManaged && (
                  <Text lineClamp={1} color={Color.BLACK}>
                    {getString('resourceGroup.builtInResourceGroup')}
                  </Text>
                )}
                {!resourceGroupDetails?.data?.resourceGroup?.harnessManaged && (
                  <ReactTimeago date={resourceGroupDetails?.data?.createdAt || ''} />
                )}
              </Text>
            </Layout.Vertical>
            <Layout.Vertical spacing="xsmall" padding={{ left: 'small' }}>
              <Text>{getString('lastUpdated')}</Text>
              <Text lineClamp={1} color={Color.BLACK}>
                {resourceGroupDetails?.data?.resourceGroup?.harnessManaged && (
                  <Text lineClamp={1} color={Color.BLACK}>
                    {getString('resourceGroup.builtInResourceGroup')}
                  </Text>
                )}
                {!resourceGroupDetails?.data?.resourceGroup?.harnessManaged && (
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
              onResourceTypeChange={onResourceTypeChanged}
              preSelectedResourceList={selectedResourceGroup || {}}
              disableAddingResources={resourceGroupDetails?.data?.resourceGroup?.harnessManaged}
            />
          </Container>
          <Container padding="xlarge">
            {!resourceGroupDetails?.data?.resourceGroup?.harnessManaged && (
              <Layout.Vertical flex={{ alignItems: 'flex-end' }} padding="small">
                <Button onClick={updateResourceGroupData} disabled={updating}>
                  {getString('applyChanges')}
                </Button>
              </Layout.Vertical>
            )}
            <SelectedResourceTypeDetailsList
              resourceTypes={getSelectedResourceTypesStrings(selectedResourceGroup) || []}
              disableAddingResources={resourceGroupDetails?.data?.resourceGroup?.harnessManaged}
            />
          </Container>
        </div>
      </Page.Body>
    </>
  ) : (
    <Page.NoDataCard icon="resources-icon" message={getString('resourceGroup.noResourceGroupFound')} />
  )
}
export default ResourceGroupDetails
