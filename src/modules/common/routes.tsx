import React from 'react'
import { RouteEntry, RouteEntryURLArgs, Layout } from 'framework'
import i18n from './routes.i18n'

export const LoginRoute: RouteEntry = {
  path: '/loginv2',
  title: i18n.login,
  pageId: 'login',
  url: () => '/login',
  page: React.lazy(() => import('./pages/login/LoginPage')),
  layout: Layout.BlankLayout
}

export const OrgRoute: RouteEntry = {
  path: '/org/:orgId?',
  title: i18n.org,
  pageId: 'org',
  url: (params: RouteEntryURLArgs) => `/org${params?.orgId ? `/${params.orgId}` : ''}`,
  page: React.lazy(() => import('./pages/org/OrgPage')),
  layout: Layout.DefaultLayout
}

export const ProjectRoute: RouteEntry = {
  path: '/project/:orgId?',
  title: i18n.project,
  pageId: 'project',
  url: (params: RouteEntryURLArgs) => `/project${params?.projectId ? `/${params.projectId}` : ''}`,
  page: React.lazy(() => import('./pages/project/ProjectPage')),
  layout: Layout.DefaultLayout
}

/* Note: This route must be at the end of this file */
/* There's a TODO improvement in src/framework/routing/Routes.ts to eliminate this restriction */
export const PageNotFoundRoute: RouteEntry = {
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => '/404',
  page: React.lazy(() => import('./pages/404/NotFoundPage')),
  layout: Layout.BlankLayout
}
