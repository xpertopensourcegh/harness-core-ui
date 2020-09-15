import React from 'react'
import { UseGetProps, RestfulProvider } from 'restful-react'
import { compile } from 'path-to-regexp'
import { createMemoryHistory } from 'history'
import { Router, Route } from 'react-router-dom'
import { ModalProvider } from '@wings-software/uikit'
import { AppStoreProvider, useAppStoreWriter } from 'framework/hooks/useAppStore'
import type { AppStore } from 'framework/types/AppStore'

export type UseGetMockData<TData, TError = undefined, TQueryParams = undefined, TPathParams = undefined> = Required<
  UseGetProps<TData, TError, TQueryParams, TPathParams>
>['mock']

interface TestWrapperProps {
  path?: string
  pathParams?: Record<string, string | number>
  defaultAppStoreValues?: Partial<AppStore>
}

const AppStoreInitializer: React.FC<{ defaultAppStoreValues: TestWrapperProps['defaultAppStoreValues'] }> = ({
  children,
  defaultAppStoreValues
}) => {
  const updateAppStore = useAppStoreWriter()
  updateAppStore(defaultAppStoreValues || {})
  return <> {children} </>
}

export const TestWrapper: React.FC<TestWrapperProps> = props => {
  const { path = '/', pathParams = {}, defaultAppStoreValues } = props

  const history = createMemoryHistory({ initialEntries: [compile(path)(pathParams)] })

  return (
    <AppStoreProvider>
      <AppStoreInitializer defaultAppStoreValues={defaultAppStoreValues}>
        <Router history={history}>
          <ModalProvider>
            <RestfulProvider base="/">
              <Route path={path}>{props.children}</Route>
            </RestfulProvider>
          </ModalProvider>
        </Router>
      </AppStoreInitializer>
    </AppStoreProvider>
  )
}
