import React from 'react'
import { useParams } from 'react-router-dom'
import { Icon, Card, Layout } from '@wings-software/uicore'
import { Checkbox } from '@blueprintjs/core'
import { useGetResourceTypes } from 'services/cd-ng'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/exports'
import RbacFactory from '@rbac/factories/RbacFactory'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import css from './ResourceTypeList.module.scss'

interface ResourceTypeListProps {
  onResourceSelectionChange: (resource: ResourceType, isAdd: boolean) => void
  preSelectedResourceList: ResourceType[]
  disableAddingResources?: boolean
}
const ResourceTypeList: React.FC<ResourceTypeListProps> = ({
  onResourceSelectionChange,
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
        listData.map(({ name: eleDetails }) => {
          const resourceDetails = RbacFactory.getResourceTypeHandler(eleDetails as ResourceType)
          if (resourceDetails) {
            const { label, icon } = resourceDetails
            return (
              <Card
                className={css.resourceTypeCard}
                key={eleDetails}
                draggable
                onDragStart={e => {
                  // TO DO: should make it work for resource types sub divisions
                  e.dataTransfer.setData('text/plain', eleDetails as ResourceType)
                  e.dataTransfer.dropEffect = 'copy'
                }}
              >
                <Checkbox
                  disabled={disableAddingResources}
                  onChange={e => {
                    onResourceSelectionChange(eleDetails as ResourceType, e.currentTarget.checked)
                  }}
                  value={eleDetails}
                  checked={preSelectedResourceList.includes(eleDetails as ResourceType)}
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
