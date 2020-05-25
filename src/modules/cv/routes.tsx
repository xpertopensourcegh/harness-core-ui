import { RouteInfo, ModuleName } from 'framework'
import React from 'react'
import i18n from './routes.i18n'

export const CVHome: RouteInfo = {
  path: '/continuous-verification',
  title: i18n.continuousVerification,
  pageId: 'continuous-verification',
  url: () => '/continuous-verification',
  component: React.lazy(() => import('./pages/home/CVHomePage')),
  module: ModuleName.CV
}
