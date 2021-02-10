import React from 'react'
import { Card, Icon, Layout, Text } from '@wings-software/uicore'

import { useHistory, useParams } from 'react-router-dom'
import type { RoleResponse } from 'services/rbac'
import routes from '@common/RouteDefinitions'
import css from './RoleCard.module.scss'

interface RoleCardProps {
  data: RoleResponse
}

const RoleCard: React.FC<RoleCardProps> = ({ data }) => {
  const { role } = data
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const history = useHistory()
  return (
    <Card
      className={css.card}
      onClick={() => {
        history.push(
          routes.toRoleDetails({ roleIdentifier: role.identifier || '', accountId, orgIdentifier, projectIdentifier })
        )
      }}
      interactive
    >
      <Layout.Vertical flex={{ align: 'center-center' }} spacing="large">
        {/* TODO: REPLACE WITH ROLE ICON */}
        <Icon name="nav-project-selected" size={40} />
        <Text>{role.name}</Text>
      </Layout.Vertical>
    </Card>
  )
}

export default RoleCard
