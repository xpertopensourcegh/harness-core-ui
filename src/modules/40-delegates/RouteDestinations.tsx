import React from 'react'

import { RouteWithLayout } from '@common/router'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, delegateConfigProps } from '@common/utils/routeUtils'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import DelegatesPage from 'modules/40-delegates/pages/delegates/DelegatesPage'
import ResourcesPage from '@common/pages/resources/ResourcesPage'
import DelegateProfileDetails from 'modules/40-delegates/pages/delegates/DelegateProfileDetails'
// import DelegateDetails from 'modules/40-delegates/pages/delegates/DelegateDetails'

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings'
}

export default (
  <>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
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
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toResourcesDelegateConfigsDetails({ ...accountPathProps, ...delegateConfigProps }),
        routes.toResourcesDelegateConfigsDetails({ ...accountPathProps, ...delegateConfigProps })
      ]}
    >
      <ResourcesPage>
        <DelegateProfileDetails />
      </ResourcesPage>
    </RouteWithLayout>
  </>
)
