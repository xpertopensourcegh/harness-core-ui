import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'
import type { RouteProps as RouterRouteprops } from 'react-router-dom'

import { ModalProvider } from '@wings-software/uicore'
import { DefaultLayout } from '@common/layouts'

export interface RouteWithLayoutProps extends RouterRouteprops {
  layout: React.ComponentType
}

export function RouteWithLayout(props: React.PropsWithChildren<RouteWithLayoutProps>): React.ReactElement {
  const { children, layout: Layout, ...rest } = props

  return (
    <RouterRoute {...rest}>
      <ModalProvider>
        <Layout>{children}</Layout>
      </ModalProvider>
    </RouterRoute>
  )
}

RouteWithLayout.defaultProps = {
  layout: DefaultLayout
}
