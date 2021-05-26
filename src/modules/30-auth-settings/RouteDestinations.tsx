import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'

import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import RbacFactory from '@rbac/factories/RbacFactory'
import { ResourceType, ResourceCategory } from '@rbac/interfaces/ResourceType'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { String } from 'framework/strings'
import Configuration from '@auth-settings/pages/Configuration/Configuration'

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings',
  icon: 'nav-settings'
}

RbacFactory.registerResourceTypeHandler(ResourceType.AUTHSETTING, {
  icon: 'nav-settings',
  label: 'authSettings.authenticationSettings',
  category: ResourceCategory.ADMINSTRATIVE_FUNCTIONS,
  permissionLabels: {
    [PermissionIdentifier.VIEW_AUTHSETTING]: <String stringID="rbac.permissionLabels.view" />,
    [PermissionIdentifier.EDIT_AUTHSETTING]: <String stringID="rbac.permissionLabels.createEdit" />,
    [PermissionIdentifier.DELETE_AUTHSETTING]: <String stringID="rbac.permissionLabels.delete" />
  }
})

const RedirectToConfiguration = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()
  return <Redirect to={routes.toAccountConfiguration(params)} />
}

export default (
  <>
    <Route
      sidebarProps={AccountSettingsSideNavProps}
      path={routes.toAuthenticationSettings({ ...accountPathProps })}
      exact
    >
      <RedirectToConfiguration />
    </Route>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={routes.toAccountConfiguration({ ...accountPathProps })}
      exact
    >
      <Configuration />
    </RouteWithLayout>
  </>
)
