import React from 'react'
import { useParams } from 'react-router-dom'
import { Checkbox, Icon, Card, Layout } from '@wings-software/uicore'
import { useGetResourceTypes } from 'services/cd-ng'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/exports'
import RbacFactory from '@rbac/factories/RbacFactory'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import type { ResourceGroupSelection, ResourceType } from '@rbac/interfaces/ResourceType'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import css from './ResourceTypeList.module.scss'

interface ResourceTypeListProps {
  onResourceTypeChange: (resource: ResourceGroupSelection) => void
  preSelectedResourceList: ResourceGroupSelection
  disableAddingResources: boolean
}
const ResourceTypeList: React.FC<ResourceTypeListProps> = ({
  onResourceTypeChange,
  preSelectedResourceList,
  disableAddingResources
}) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const { data: resourceTypeData, error: errorGetResourceTypes, loading } = useGetResourceTypes({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier
    }
  })
  const { getString } = useStrings()
  const listData = resourceTypeData?.data?.resourceTypes || []
  if (errorGetResourceTypes) {
    return <PageError message={errorGetResourceTypes.message}></PageError>
  }
  if (loading) {
    return <PageSpinner></PageSpinner>
  }
  return (
    <Layout.Vertical flex spacing="small">
      {listData.length ? (
        listData.map(eleDetails => {
          const resourceDetails = RbacFactory.getResourceTypeHandler(eleDetails as ResourceType)
          if (resourceDetails) {
            const { label, icon } = resourceDetails
            return (
              <Card className={css.resourceTypeCard} key={eleDetails}>
                <Checkbox
                  disabled={disableAddingResources}
                  padding={{ left: 'large' }}
                  onChange={e => {
                    e.stopPropagation()
                    onResourceTypeChange({ [e.currentTarget.value]: e.currentTarget.checked })
                  }}
                  value={eleDetails}
                  defaultChecked={!!(preSelectedResourceList && preSelectedResourceList[eleDetails])}
                >
                  <Icon name={icon} padding={{ left: 'medium', right: 'small' }} />
                  {label}
                </Checkbox>
              </Card>
            )
          }
        })
      ) : (
        <NoDataCard icon="resources-icon" message={getString('resourceGroup.noResourceGroupTypes')}></NoDataCard>
      )}
    </Layout.Vertical>
  )
}
export default ResourceTypeList
