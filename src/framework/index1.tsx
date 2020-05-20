import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { FocusStyleManager } from '@blueprintjs/core'
import { RouteDestinations } from 'routes'
import { AppContextProvider, useAppContext } from '../contexts/AppContext'
import { Routes } from './routes'
import { importRoute, EnsureAppContextAvailability, LegacyRouteToAppContextHelper, RedirectRoot } from './RouteUtils'
import { PageLayout } from '../layouts/PageLayout'
import { PageContextProvider } from 'contexts/PageContext'
import AppShell from './AppShell'

FocusStyleManager.onlyShowFocusOnTabs()

export default function Index() {
  return (
    <AppContextProvider>
      <HashRouter>
        <AppShell>
          <LegacyRouteToAppContextHelper />
          <Switch>
            {/* Naked root path is redirected to login or dashboard */}
            <Route path="/" exact component={RedirectRoot} />

            {/* New routes which implement new architecture are defined
                in ./routes/Routes. They are always under PageLayout */}
            {Object.values(Routes).map(route => importRoute(route))}

            {/* Legacy routes are wrapped under PageLayout when featureFlag is on.
                Note that they always receive essential context data from AppShell/AppContext */}
            <Route path="/account/*">
              <EnsureAppContextAvailability>
                <LegacyRoutes />
              </EnsureAppContextAvailability>
            </Route>

            {/* Others (Login, Register, Activation...) are handled by legacy RouteDestinations.
                Note that AppShell does not fetch data for these unauth routes */}
            <Route path="*">{RouteDestinations}</Route>
          </Switch>
        </AppShell>
      </HashRouter>
    </AppContextProvider>
  )
}

function hideElevioLauncher() {
  setTimeout(() => {
    const elevioEl = document.querySelectorAll('._elevio_launcher')
    if (elevioEl && elevioEl[0]) {
      ;(elevioEl[0] as HTMLElement).style.display = 'none'
    }
  }, 1000)
}

function LegacyRoutes() {
  const { featureFlag } = useAppContext()

  if (featureFlag.SIDE_NAVIGATION) {
    hideElevioLauncher()
  }

  return (
    <>
      {featureFlag.SIDE_NAVIGATION ? (
        <PageContextProvider>
          <PageLayout>{RouteDestinations}</PageLayout>
        </PageContextProvider>
      ) : (
        RouteDestinations
      )}
    </>
  )
}
