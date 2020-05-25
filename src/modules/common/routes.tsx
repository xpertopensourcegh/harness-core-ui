import React from 'react'
import { RouteInfo, RouteInfoURLArgs, PageLayout, ModuleName } from 'framework'
import i18n from './routes.i18n'

export const CommonLogin: RouteInfo = {
  module: ModuleName.COMMON,
  layout: PageLayout.BlankLayout,
  path: '/loginv2',
  title: i18n.login,
  pageId: 'login',
  url: () => '/login',
  component: React.lazy(() => import('./pages/login/LoginPage')),
  authenticated: false
}

export const CommonOrg: RouteInfo = {
  module: ModuleName.COMMON,
  layout: PageLayout.DefaultLayout,
  path: '/org/:orgId?',
  title: i18n.org,
  pageId: 'org',
  url: (params: RouteInfoURLArgs) => `/org${params?.orgId ? `/${params.orgId}` : ''}`,
  component: React.lazy(() => import('./pages/org/OrgPage'))
}

export const CommonProject: RouteInfo = {
  module: ModuleName.COMMON,
  layout: PageLayout.DefaultLayout,
  path: '/project/:orgId?',
  title: i18n.project,
  pageId: 'project',
  url: (params: RouteInfoURLArgs) => `/project${params?.projectId ? `/${params.projectId}` : ''}`,
  component: React.lazy(() => import('./pages/project/ProjectPage'))
}

export const CommonPageNotFound: RouteInfo = {
  module: ModuleName.COMMON,
  layout: PageLayout.BlankLayout,
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => '/404',
  component: React.lazy(() => import('./pages/404/NotFoundPage')),
  authenticated: false
}

export const CommonSettings: RouteInfo = {
  module: ModuleName.COMMON,
  layout: PageLayout.BlankLayout,
  path: '/settings',
  title: i18n.settings,
  pageId: 'settings',
  url: () => '/settings',
  component: React.lazy(() => import('./pages/settings/SettingsPage'))
}

export const CommonUserProfile: RouteInfo = {
  module: ModuleName.COMMON,
  layout: PageLayout.BlankLayout,
  path: '/user-profile',
  title: i18n.userProfile,
  pageId: 'user-profile',
  url: () => '/user-profile',
  component: React.lazy(() => import('./pages/user-profile/UserProfilePage'))
}
