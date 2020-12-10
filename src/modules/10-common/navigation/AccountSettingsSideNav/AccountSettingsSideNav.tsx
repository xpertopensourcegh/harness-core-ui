import React from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '@wings-software/uikit'

import routes from '@common/RouteDefinitions'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'

export default function AccountSettingsSideNav(): React.ReactElement {
  const { accountId } = useParams<AccountPathProps>()

  return (
    <Layout.Vertical spacing="small">
      <SidebarLink exact label="Overview" to={routes.toAdmin({ accountId })} />
      <SidebarLink label="Resources" to={routes.toResources({ accountId })} />
      <SidebarLink label="Governance" to={routes.toGovernance({ accountId })} />
      <SidebarLink label="Git Sync" to={routes.toGitSync({ accountId })} />
      <SidebarLink label="Organizations" to={routes.toOrganizations({ accountId })} />
    </Layout.Vertical>
  )
}
