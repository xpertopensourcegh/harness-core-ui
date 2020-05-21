import { FocusStyleManager } from '@blueprintjs/core'
import React from 'react'
import { HashRouter, Switch } from 'react-router-dom'
import AppShell from './AppShell'
import { Routes } from '../route/Routes'
import { importRoute } from '../RouteUtils'

FocusStyleManager.onlyShowFocusOnTabs()

export default function Index(): React.ReactNode {
  return (
    <HashRouter>
      <AppShell>
        <Switch>{Object.values(Routes).map(route => importRoute(route))}</Switch>
      </AppShell>
    </HashRouter>
  )
}
