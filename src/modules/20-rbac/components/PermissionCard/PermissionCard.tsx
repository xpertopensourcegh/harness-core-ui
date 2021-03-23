import React from 'react'
import cx from 'classnames'
import { Card, Icon, Layout, Text } from '@wings-software/uicore'
import { Checkbox } from '@blueprintjs/core'
import type { Permission } from 'services/rbac'
import RbacFactory from '@rbac/factories/RbacFactory'
import type { ResourceType, ResourceTypeGroup } from '@rbac/interfaces/ResourceType'
import css from './PermissionCard.module.scss'

interface PermissionCardProps {
  resourceType: ResourceType | ResourceTypeGroup
  permissionMap: Map<ResourceType, Permission[]>
  selected?: boolean
  isDefault?: boolean
  onChangePermission: (permission: string, isAdd: boolean) => void
  isPermissionEnabled: (_permission: string) => boolean
}

const PermissionCard: React.FC<PermissionCardProps> = ({
  resourceType,
  selected,
  isDefault,
  permissionMap,
  onChangePermission,
  isPermissionEnabled
}) => {
  const getPermissionList = (resource: ResourceType): JSX.Element => {
    return (
      <div className={css.permissionList}>
        {permissionMap.get(resource)?.map(permission => {
          return (
            <Checkbox
              label={permission.action}
              data-testid={`checkBox-${resource}-${permission.action}`}
              key={permission.name}
              disabled={isDefault}
              defaultChecked={isPermissionEnabled(permission.identifier)}
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                onChangePermission(permission.identifier, event.currentTarget.checked)
              }}
              className={css.checkbox}
            />
          )
        })}
      </div>
    )
  }
  const resourceHandler = RbacFactory.getResourceGroupTypeHandler(resourceType)
  return resourceHandler ? (
    <Card className={cx(css.card, { [css.selectedCard]: selected })}>
      <Layout.Vertical padding="small" width="100%">
        <Layout.Horizontal width="100%" className={css.permissionRow}>
          <Layout.Horizontal spacing="medium" className={css.center}>
            <Icon name={resourceHandler.icon} size={20} />
            <Text>{resourceHandler.label}</Text>
          </Layout.Horizontal>
          {resourceHandler.resourceTypes?.length ? null : getPermissionList(resourceType as ResourceType)}
        </Layout.Horizontal>
        {resourceHandler.resourceTypes?.length ? (
          <Layout.Vertical padding={{ top: 'large' }}>
            {resourceHandler.resourceTypes?.map(resource => {
              const handler = RbacFactory.getResourceTypeHandler(resource)
              return (
                handler && (
                  <div key={resource} className={cx(css.permissionRow, css.groupRow)}>
                    <Text>{handler.label}</Text>
                    {getPermissionList(resource)}
                  </div>
                )
              )
            })}
          </Layout.Vertical>
        ) : null}
      </Layout.Vertical>
    </Card>
  ) : null
}

export default PermissionCard
