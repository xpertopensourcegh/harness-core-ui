import React from 'react'
import { Route } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import SidebarProvider from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps } from '@common/utils/routeUtils'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import DelegatesPage from 'modules/40-delegates/pages/delegates/DelegatesPage'
// import DelegateDetailsPage from '@delegates/pages/delegates/DelegateDetailsPage'
// import CreateDelegateFromYamlPage from '@delegates/pages/createDelegateFromYaml/CreateDelegateFromYamlPage'
import ResourcesPage from '@common/pages/resources/ResourcesPage'

export default (
  <SidebarProvider navComponent={AccountSettingsSideNav} subtitle="ACCOUNT" title="Settings">
    <Route path="/">
      <RouteWithLayout
        path={[
          routes.toResourcesDelegates({ ...accountPathProps }),
          routes.toOrgResourcesDelegates({ ...accountPathProps, ...orgPathProps })
        ]}
        exact
      >
        <ResourcesPage>
          <DelegatesPage />
        </ResourcesPage>
      </RouteWithLayout>
    </Route>
  </SidebarProvider>
)
