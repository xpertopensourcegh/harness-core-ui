import { RouteEntry, ModuleName } from 'framework'
import React from 'react'
import i18n from './routes.i18n'

export const CVHome: RouteEntry = {
  path: '/continuous-verification',
  title: i18n.continuousVerification,
  pageId: 'continuous-verification',
  url: () => '/continuous-verification',
  component: React.lazy(() => import('./pages/home/CVHomePage')),
  module: ModuleName.CV
}
