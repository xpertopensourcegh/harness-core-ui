import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeUserProfile: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.USER_PROFILE,
  path: '/user-profile',
  title: i18n.userProfile,
  pageId: 'user-profile',
  url: () => routeURL(routeUserProfile, '/user-profile'),
  component: React.lazy(() => import('@common/pages/user-profile/UserProfilePage'))
}
