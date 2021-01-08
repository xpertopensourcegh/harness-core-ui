import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { RestfulProvider } from 'restful-react'
import { FocusStyleManager } from '@blueprintjs/core'
import SessionToken from 'framework/utils/SessionToken'
import languageLoader from 'strings/languageLoader'
import type { LangLocale } from 'strings/languageLoader'
import { AppStoreProvider } from 'framework/AppStore/AppStoreContext'
import RouteDestinations from 'modules/RouteDestinations'
import AppErrorBoundary from 'framework/utils/AppErrorBoundary/AppErrorBoundary'
import NotFoundPage from '@common/pages/404/NotFoundPage'

import '@common/services'
import './App.scss'

FocusStyleManager.onlyShowFocusOnTabs()

interface AppProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strings: Record<string, any>
}

function App(props: AppProps): React.ReactElement {
  const token = SessionToken.getToken()
  const getRequestOptions = React.useCallback((): Partial<RequestInit> => {
    const headers: RequestInit['headers'] = {}

    if (token && token.length > 0) {
      headers.Authorization = `Bearer ${token}`
    }

    return { headers }
  }, [token])

  return (
    <RestfulProvider base="/" requestOptions={getRequestOptions}>
      <AppStoreProvider strings={props.strings}>
        <AppErrorBoundary>
          <RouteDestinations />
          <Route path="*">
            <NotFoundPage />
          </Route>
        </AppErrorBoundary>
      </AppStoreProvider>
    </RestfulProvider>
  )
}

;(async () => {
  const lang: LangLocale = 'en'

  const strings = await languageLoader(lang)

  ReactDOM.render(
    <HashRouter>
      <Route
        path={[
          '/account/:accountId/:module/orgs/:orgIdentifier/projects/:projectIdentifier',
          '/account/:accountId',
          '/*'
        ]}
      >
        <App strings={strings} />
      </Route>
    </HashRouter>,
    document.getElementById('react-root')
  )
})()
