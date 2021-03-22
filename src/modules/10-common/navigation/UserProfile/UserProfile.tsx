import React from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '@wings-software/uicore'

import routes from '@common/RouteDefinitions'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { useStrings } from 'framework/exports'

export default function UserProfile(): React.ReactElement {
  const { accountId } = useParams<AccountPathProps>()
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="small">
      <SidebarLink exact label={getString('profile')} to={routes.toUserProfile({ accountId })} />
      <SidebarLink label={getString('preferences')} to={routes.toUserPreferences({ accountId })} />
    </Layout.Vertical>
  )
}
