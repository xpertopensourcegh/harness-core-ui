import React from 'react'

import { Redirect, useParams } from 'react-router-dom'
import { RouteWithLayout } from '@common/router'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import {
  accountPathProps,
  orgPathProps,
  rolePathProps,
  resourceGroupPathProps,
  userGroupPathProps,
  userPathProps
} from '@common/utils/routeUtils'

import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import AccessControlPage from '@rbac/pages/AccessControl/AccessControlPage'
import UsersPage from '@rbac/pages/Users/UsersPage'
import UserGroups from '@rbac/pages/UserGroups/UserGroups'
import Roles from '@rbac/pages/Roles/Roles'
import ResourceGroups from '@rbac/pages/ResourceGroups/ResourceGroups'
import { String } from 'framework/strings'
import RoleDetails from '@rbac/pages/RoleDetails/RoleDetails'
import { ResourceCategory } from '@rbac/interfaces/ResourceType'
import UserGroupDetails from '@rbac/pages/UserGroupDetails/UserGroupDetails'
import ResourceGroupDetails from '@rbac/pages/ResourceGroupDetails/ResourceGroupDetails'
import RbacFactory from '@rbac/factories/RbacFactory'
import type { OrgPathProps } from '@common/interfaces/RouteInterfaces'
import UserDetails from './pages/UserDetails/UserDetails'

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings'
}

RbacFactory.registerResourceCategory(ResourceCategory.SHARED_RESOURCES, {
  icon: 'support-tour',
  label: <String stringID="rbac.categoryLabels.sharedResources" />
})

RbacFactory.registerResourceCategory(ResourceCategory.ADMINSTRATIVE_FUNCTIONS, {
  icon: 'support-account',
  label: <String stringID="adminFunctions" />
})

const RedirectToAccessControlHome = (): React.ReactElement => {
  const { accountId, orgIdentifier } = useParams<OrgPathProps>()
  return <Redirect to={routes.toUsers({ accountId, orgIdentifier })} />
}

export default (
  <>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[routes.toAccessControl({ ...accountPathProps }), routes.toAccessControl({ ...orgPathProps })]}
      exact
    >
      <RedirectToAccessControlHome />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[routes.toUsers({ ...accountPathProps }), routes.toUsers({ ...orgPathProps })]}
      exact
    >
      <AccessControlPage>
        <UsersPage />
      </AccessControlPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toUserDetails({ ...accountPathProps, ...userPathProps }),
        routes.toUserDetails({ ...orgPathProps, ...userPathProps })
      ]}
      exact
    >
      <UserDetails />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[routes.toUserGroups({ ...accountPathProps }), routes.toUserGroups({ ...orgPathProps })]}
      exact
    >
      <AccessControlPage>
        <UserGroups />
      </AccessControlPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toUserGroupDetails({ ...accountPathProps, ...userGroupPathProps }),
        routes.toUserGroupDetails({ ...orgPathProps, ...userGroupPathProps })
      ]}
      exact
    >
      <UserGroupDetails />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[routes.toResourceGroups({ ...accountPathProps }), routes.toResourceGroups({ ...orgPathProps })]}
      exact
    >
      <AccessControlPage>
        <ResourceGroups />
      </AccessControlPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[routes.toRoles({ ...accountPathProps }), routes.toRoles({ ...orgPathProps })]}
      exact
    >
      <AccessControlPage>
        <Roles />
      </AccessControlPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toRoleDetails({ ...accountPathProps, ...rolePathProps }),
        routes.toRoleDetails({ ...orgPathProps, ...rolePathProps })
      ]}
      exact
    >
      <RoleDetails />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toResourceGroupDetails({ ...accountPathProps, ...resourceGroupPathProps }),
        routes.toResourceGroupDetails({ ...orgPathProps, ...resourceGroupPathProps })
      ]}
      exact
    >
      <ResourceGroupDetails />
    </RouteWithLayout>
  </>
)
