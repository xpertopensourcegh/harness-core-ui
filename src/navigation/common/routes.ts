import React from 'react'
import { Route, PageLayout, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeLogin: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '/loginv2',
  title: i18n.login,
  pageId: 'login',
  url: () => '/login',
  component: React.lazy(() => import('@common/pages/login/LoginPage')),
  authenticated: false
}

export const routePageNotFound: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => routeURL(routePageNotFound, '/404'),
  component: React.lazy(() => import('@common/pages/404/NotFoundPage')),
  authenticated: false
}
