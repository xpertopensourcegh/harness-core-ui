import React from 'react'
import { RouteEntry, RouteEntryURLArgs, PageLayout, ModuleName } from 'framework'
import i18n from './routes.i18n'

export const CommonLogin: RouteEntry = {
  path: '/loginv2',
  title: i18n.login,
  pageId: 'login',
  url: () => '/login',
  component: React.lazy(() => import('./pages/login/LoginPage')),
  module: ModuleName.COMMON,
  layout: PageLayout.BlankLayout,
  authenticated: false
}

export const CommonOrg: RouteEntry = {
  path: '/org/:orgId?',
  title: i18n.org,
  pageId: 'org',
  url: (params: RouteEntryURLArgs) => `/org${params?.orgId ? `/${params.orgId}` : ''}`,
  component: React.lazy(() => import('./pages/org/OrgPage')),
  module: ModuleName.COMMON,
  layout: PageLayout.DefaultLayout
}

export const CommonProject: RouteEntry = {
  path: '/project/:orgId?',
  title: i18n.project,
  pageId: 'project',
  url: (params: RouteEntryURLArgs) => `/project${params?.projectId ? `/${params.projectId}` : ''}`,
  component: React.lazy(() => import('./pages/project/ProjectPage')),
  module: ModuleName.COMMON,
  layout: PageLayout.DefaultLayout
}

export const CommonPageNotFound: RouteEntry = {
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => '/404',
  component: React.lazy(() => import('./pages/404/NotFoundPage')),
  module: ModuleName.COMMON,
  layout: PageLayout.BlankLayout,
  authenticated: false
}
