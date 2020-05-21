import type { ModuleRouteEntries } from 'framework'
import i18n from './routes.i18n'
import NotFoundPage from './pages/404/NotFoundPage'
import LoginPage from './pages/login/LoginPage'
import { Layout } from 'framework'

export const CommonRoutes: ModuleRouteEntries = {
  LoginPage: {
    path: '/login',
    title: i18n.login,
    pageId: 'login',
    url: () => '/login',
    page: LoginPage,
    layout: Layout.BlankLayout
  },

  NotFoundPage: {
    path: '*',
    title: i18n.notFound,
    pageId: '404',
    url: () => '/404',
    page: NotFoundPage,
    layout: Layout.BlankLayout
  }
}
