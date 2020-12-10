import React from 'react'
import { UseGetProps, UseGetReturn, RestfulProvider } from 'restful-react'
import { compile } from 'path-to-regexp'
import { createMemoryHistory } from 'history'
import { Router, Route, Switch, useLocation } from 'react-router-dom'
import { ModalProvider } from '@wings-software/uikit'
import qs from 'qs'

import strings from 'strings/strings.en.yaml'
import { AppStoreContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { withAccountId, accountPathProps } from '@common/utils/routeUtils'
import type { Project } from 'services/cd-ng'

export type UseGetMockData<TData, TError = undefined, TQueryParams = undefined, TPathParams = undefined> = Required<
  UseGetProps<TData, TError, TQueryParams, TPathParams>
>['mock']

export interface UseMutateMockData<TData, TRequestBody = unknown> {
  loading?: boolean
  mutate?: (data?: TRequestBody) => Promise<TData>
}

export type UseGetReturnData<TData, TError = undefined, TQueryParams = undefined, TPathParams = undefined> = Omit<
  UseGetReturn<TData, TError, TQueryParams, TPathParams>,
  'absolutePath' | 'cancel' | 'response'
>

export const findDialogContainer = (): HTMLElement | null => document.querySelector('.bp3-dialog')
export const findPopoverContainer = (): HTMLElement | null => document.querySelector('.bp3-popover-content')

export interface TestWrapperProps {
  path?: string
  pathParams?: Record<string, string | number>
  queryParams?: Record<string, unknown>
  defaultAppStoreValues?: Partial<AppStoreContextProps>
  strings?: Record<string, unknown[]>
  projects?: Project[]
}

export const prependAccountPath = (path: string): string => withAccountId(() => path)(accountPathProps)

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
  const { path = '/', pathParams = {}, defaultAppStoreValues, queryParams = {}, projects = [] } = props

  const search = qs.stringify(queryParams, { addQueryPrefix: true })
  const routePath = compile(path)(pathParams) + search

  const history = createMemoryHistory({ initialEntries: [routePath] })

  return (
    <AppStoreContext.Provider
      value={{
        strings,
        projects,
        updateAppStore: jest.fn(),
        user: {},
        ...defaultAppStoreValues
      }}
    >
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
    </AppStoreContext.Provider>
  )
}
