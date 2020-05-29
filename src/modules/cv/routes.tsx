import { Route, ModuleName, SidebarIdentifier } from 'framework/exports'
import React from 'react'
import i18n from './routes.i18n'

export const routeCVHome: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/continuous-verification',
  title: i18n.title,
  pageId: 'continuous-verification',
  url: () => '/continuous-verification',
  component: React.lazy(() => import('./pages/home/CVHomePage')),
  module: ModuleName.CV
}
