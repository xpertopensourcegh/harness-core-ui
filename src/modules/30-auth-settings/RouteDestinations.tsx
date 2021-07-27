import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import Configuration from '@auth-settings/pages/Configuration/Configuration'
import AccountOverview from '@auth-settings/pages/AccountOverview/AccountOverview'
import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'

import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import RbacFactory from '@rbac/factories/RbacFactory'
import { ResourceType, ResourceCategory } from '@rbac/interfaces/ResourceType'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { String } from 'framework/strings'
import { AccountSideNavProps } from '@common/RouteDestinations'

RbacFactory.registerResourceTypeHandler(ResourceType.ACCOUNT, {
  icon: 'nav-settings',
  label: 'common.accountSettings',
  category: ResourceCategory.ADMINSTRATIVE_FUNCTIONS,
  permissionLabels: {
    [PermissionIdentifier.VIEW_ACCOUNT]: <String stringID="rbac.permissionLabels.view" />,
    [PermissionIdentifier.EDIT_ACCOUNT]: <String stringID="edit" />
  }
})

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

const RedirectToOverview = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()
  return <Redirect to={routes.toAccountSettingsOverview(params)} />
}

export default (
  <>
    <RouteWithLayout sidebarProps={AccountSideNavProps} path={routes.toAccountSettings({ ...accountPathProps })} exact>
      <RedirectToOverview />
    </RouteWithLayout>
    <Route sidebarProps={AccountSideNavProps} path={routes.toAuthenticationSettings({ ...accountPathProps })} exact>
      <RedirectToConfiguration />
    </Route>
    <RouteWithLayout
      sidebarProps={AccountSideNavProps}
      path={routes.toAccountConfiguration({ ...accountPathProps })}
      exact
    >
      <Configuration />
    </RouteWithLayout>
    <RouteWithLayout
      sidebarProps={AccountSideNavProps}
      path={routes.toAccountSettingsOverview({ ...accountPathProps })}
      exact
    >
      <AccountOverview />
    </RouteWithLayout>
  </>
)
