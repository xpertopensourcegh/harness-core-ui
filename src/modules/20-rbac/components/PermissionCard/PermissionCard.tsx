import React from 'react'
import { Card, Icon, Layout, Text } from '@wings-software/uicore'
import cx from 'classnames'
import { useParams } from 'react-router-dom'
import { Checkbox } from '@blueprintjs/core'
import { useGetPermissionList } from 'services/rbac'
import type { ResourceHandler } from '@rbac/factories/RbacFactory'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import css from './PermissionCard.module.scss'

interface PermissionCardProps {
  resourceType: ResourceType
  resourceHandler: ResourceHandler
  isDefault?: boolean
}

const PermissionCard: React.FC<PermissionCardProps> = ({ resourceHandler, resourceType, isDefault }) => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const { data, loading, error, refetch } = useGetPermissionList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      resourceType: resourceType
    }
  })
  if (loading) return <PageSpinner />
  if (error) return <PageError message={(error.data as Error)?.message || error.message} onClick={() => refetch()} />

  return (
    <Card className={css.card}>
      <Layout.Horizontal padding="large" width="100%" className={css.permissions}>
        <Layout.Horizontal spacing="medium" className={css.center}>
          <Icon name={resourceHandler.icon} size={20} />
          <Text>{resourceHandler.label}</Text>
        </Layout.Horizontal>

        <Layout.Horizontal spacing="small" className={cx(css.end, css.center)} padding={{ right: 'large' }}>
          {data?.data?.map(response => {
            const permission = response.permission
            return (
              <Checkbox label={permission.name} key={permission.name} disabled={isDefault} className={css.checkbox} />
            )
          })}
        </Layout.Horizontal>
      </Layout.Horizontal>
    </Card>
  )
}

export default PermissionCard
