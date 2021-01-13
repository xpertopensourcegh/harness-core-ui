import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'
import type { RouteProps as RouterRouteprops } from 'react-router-dom'

import { ModalProvider } from '@wings-software/uicore'
import { DefaultLayout } from '@common/layouts'
import SidebarProvider, { SidebarContext } from '@common/navigation/SidebarProvider'

export interface RouteWithLayoutProps extends RouterRouteprops {
  layout: React.ComponentType
  sidebarProps?: SidebarContext
}

export function RouteWithLayout(props: React.PropsWithChildren<RouteWithLayoutProps>): React.ReactElement {
  const { children, layout: Layout, sidebarProps, ...rest } = props

  return (
    <RouterRoute {...rest}>
      <ModalProvider>
        {sidebarProps ? (
          <SidebarProvider {...sidebarProps}>
            <Layout>{children}</Layout>
          </SidebarProvider>
        ) : (
          <Layout>{children}</Layout>
        )}
      </ModalProvider>
    </RouterRoute>
  )
}

RouteWithLayout.defaultProps = {
  layout: DefaultLayout
}
