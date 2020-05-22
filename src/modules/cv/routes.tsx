import type { RouteEntry } from 'framework'
import React from 'react'
import i18n from './routes.i18n'

export const CVHome: RouteEntry = {
  path: '/continuous-verification',
  title: i18n.continuousVerification,
  pageId: 'continuous-verification',
  url: () => '/continuous-verification',
  page: React.lazy(() => import('./pages/home/CVHomePage'))
}
