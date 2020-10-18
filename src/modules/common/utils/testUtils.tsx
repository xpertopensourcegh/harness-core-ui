import React from 'react'
import { UseGetProps, RestfulProvider } from 'restful-react'
import { compile } from 'path-to-regexp'
import { createMemoryHistory } from 'history'
import { Router, Route, Switch, useLocation } from 'react-router-dom'
import { ModalProvider } from '@wings-software/uikit'
import qs from 'qs'

import { AppStoreProvider, useAppStoreWriter } from 'framework/hooks/useAppStore'
import type { AppStore } from 'framework/types/AppStore'
import { AUTH_ROUTE_PATH_PREFIX } from 'framework/exports'

export type UseGetMockData<TData, TError = undefined, TQueryParams = undefined, TPathParams = undefined> = Required<
  UseGetProps<TData, TError, TQueryParams, TPathParams>
>['mock']
interface TestWrapperProps {
  path?: string
  pathParams?: Record<string, string | number>
  queryParams?: Record<string, any>
  defaultAppStoreValues?: Partial<AppStore>
}

export interface UseMutateMockData<TData, TRequestBody = unknown> {
  loading?: boolean
  mutate?: (data?: TRequestBody) => Promise<TData>
}
export const prependAccountPath = (path: string): string => AUTH_ROUTE_PATH_PREFIX + path

const AppStoreInitializer: React.FC<{ defaultAppStoreValues: TestWrapperProps['defaultAppStoreValues'] }> = ({
  children,
  defaultAppStoreValues
}) => {
  const updateAppStore = useAppStoreWriter()
  updateAppStore(defaultAppStoreValues || {})
  return <> {children} </>
}

export const NotFound = (): JSX.Element => {
  const location = useLocation()
  return (
    <div>
      <h1>Not Found</h1>
      <div data-testid="location">{`${location.pathname}${
        location.search ? `?${location.search.replace(/^\?/g, '')}` : ''
      }`}</div>
    </div>
  )
}

export const TestWrapper: React.FC<TestWrapperProps> = props => {
  const { path = '/', pathParams = {}, defaultAppStoreValues, queryParams = {} } = props

  const search = qs.stringify(queryParams, { addQueryPrefix: true })
  const routePath = compile(path)(pathParams) + search

  const history = createMemoryHistory({ initialEntries: [routePath] })

  return (
    <AppStoreProvider>
      <AppStoreInitializer defaultAppStoreValues={defaultAppStoreValues}>
        <Router history={history}>
          <ModalProvider>
            <RestfulProvider base="/">
              <Switch>
                <Route exact path={path}>
                  {props.children}
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </RestfulProvider>
          </ModalProvider>
        </Router>
      </AppStoreInitializer>
    </AppStoreProvider>
  )
}
