import React from 'react'
import { Route, Redirect, useParams } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps } from '@common/utils/routeUtils'

import AdminPage from '@common/pages/AccountSettings/AdminPage'
import GovernancePage from '@common/pages/governance/GovernancePage'
import AccountSetingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import SessionToken from 'framework/utils/SessionToken'
import SidebarProvider from './navigation/SidebarProvider'
import type { AccountPathProps } from './interfaces/RouteInterfaces'

const RedirectToHome = (): React.ReactElement => {
  const accountId = SessionToken.accountId()

  return <Redirect to={routes.toProjects({ accountId })} />
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toResourcesConnectors(params)} />
}

export default (
  <SidebarProvider navComponent={AccountSetingsSideNav} subtitle="ACCOUNT" title="Settings">
    <Route path="/">
      <Route exact path="/">
        <RedirectToHome />
      </Route>
      <Route exact path={routes.toResources({ ...accountPathProps })}>
        <RedirectToResourcesHome />
      </Route>
      <RouteWithLayout path={routes.toAdmin({ ...accountPathProps })} exact>
        <AdminPage />
      </RouteWithLayout>
      <RouteWithLayout
        path={[
          routes.toGovernance({ ...accountPathProps }),
          routes.toOrgGovernance({ ...accountPathProps, ...orgPathProps })
        ]}
        exact
      >
        <GovernancePage />
      </RouteWithLayout>
    </Route>
  </SidebarProvider>
)
