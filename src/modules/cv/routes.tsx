import { RouteInfo, ModuleName, NavIdentifier } from 'framework'
import React from 'react'
import i18n from './cv.i18n'

export const routeContinuousVerification: RouteInfo = {
  navId: NavIdentifier.CONTINUOUS_VERIFICATION,
  path: '/continuous-verification',
  title: i18n.title,
  pageId: 'continuous-verification',
  url: () => '/continuous-verification',
  component: React.lazy(() => import('./pages/home/CVHomePage')),
  module: ModuleName.CV
}
