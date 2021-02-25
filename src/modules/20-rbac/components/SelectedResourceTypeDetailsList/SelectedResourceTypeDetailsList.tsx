import React from 'react'
import { Layout, Text, Card, Color, Radio, Button } from '@wings-software/uicore'
import RbacFactory from '@rbac/factories/RbacFactory'
import { useStrings } from 'framework/exports'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import css from './SelectedResourceTypeDetailsList.module.scss'
interface SelectedResourceTypeDetailsListProps {
  // TODO: change when individual resource selection is enabled instead of All ResourcesType
  resourceTypes: ResourceType[]
  disableAddingResources: boolean
}

const SelectedResourceTypeDetailsList: React.FC<SelectedResourceTypeDetailsListProps> = ({
  resourceTypes = [],
  disableAddingResources
}) => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="small" height="100%">
      {resourceTypes.length ? (
        resourceTypes.map(resourceType => {
          const resourceDetails = RbacFactory.getResourceTypeHandler(resourceType)
          if (resourceDetails) {
            const { label, icon } = resourceDetails
            return (
              <Card className={css.selectedResourceGroupCardDetails} key={resourceType}>
                <Text lineClamp={1} icon={icon} iconProps={{ size: 20, padding: { right: 'medium' } }}>
                  {label}
                </Text>
                {/* TODO: remove by default checked */}
                <Radio
                  label={getString('resourceGroup.all', { name: label })}
                  className={css.radioBtn}
                  defaultChecked
                ></Radio>
                <Text lineClamp={1} color={Color.GREY_400} className={css.limitAccessCell}>
                  {getString('resourceGroup.limitAccess', { name: label })}
                </Text>
                <Button intent="primary" minimal disabled={disableAddingResources} className={css.addResourceBtn}>
                  {getString('resourceGroup.add', { name: label })}
                </Button>
              </Card>
              // TODO: Place where selected individual resource table should come
            )
          }
        })
      ) : (
        <NoDataCard icon="resources-icon" message={getString('resourceGroup.selectResourceGroup')}></NoDataCard>
      )}
    </Layout.Vertical>
  )
}
export default SelectedResourceTypeDetailsList
