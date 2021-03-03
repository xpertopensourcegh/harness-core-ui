import React from 'react'
import cx from 'classnames'
import { Card, Icon, Layout, Text } from '@wings-software/uicore'
import { Checkbox } from '@blueprintjs/core'
import type { Permission } from 'services/rbac'
import RbacFactory from '@rbac/factories/RbacFactory'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import css from './PermissionCard.module.scss'

interface PermissionCardProps {
  resourceType: ResourceType
  permissions?: Permission[]
  selected?: boolean
  isDefault?: boolean
  onChangePermission: (permission: string, isAdd: boolean) => void
  isPermissionEnabled: (_permission: string) => boolean
}

const PermissionCard: React.FC<PermissionCardProps> = ({
  resourceType,
  selected,
  isDefault,
  permissions,
  onChangePermission,
  isPermissionEnabled
}) => {
  const resourceHandler = RbacFactory.getResourceTypeHandler(resourceType)
  return resourceHandler ? (
    <Card className={cx(css.card, { [css.selectedCard]: selected })}>
      <Layout.Horizontal padding="large" width="100%" className={css.permissionRow}>
        <Layout.Horizontal spacing="medium" className={css.center}>
          <Icon name={resourceHandler.icon} size={20} />
          <Text>{resourceHandler.label}</Text>
        </Layout.Horizontal>

        <div className={css.permissionList}>
          {permissions?.map(permission => {
            return (
              <Checkbox
                label={permission.action}
                data-testid={`checkBox-${resourceType}-${permission.action}`}
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
      </Layout.Horizontal>
    </Card>
  ) : null
}

export default PermissionCard
