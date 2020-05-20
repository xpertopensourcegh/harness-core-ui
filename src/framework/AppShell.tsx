import React, { useEffect, useState, useRef } from 'react'
import { useAppContext, AppContextSetter, initialAppContextInfo } from 'contexts/AppContext'
import { AccountService, UsersService, ApplicationService } from 'services'
import { RouteLoading } from './RouteUtils'
import xhr from '@wings-software/xhr-async'

const xhrGroup = 'app-shell'
const PAGE_CHANGED_EVENT = 'hashchange'

async function fetchAppContextData(accountId: string, setAppContext: AppContextSetter) {
  const [
    { accountInfo: activeAccount, error: accountError },
    { permissionData: permission, error: permissionsError },
    { featureFlags: featureFlag, error: featureFlagError },
    { resource: user, error: userError },
    { resource: version, error: versionError }
  ] = await Promise.all([
    AccountService.fetchAccountInfo({ accountId, xhrGroup }),
    UsersService.getUserPermissions(accountId, xhrGroup),
    ApplicationService.getFeatureFlags({ accountId, xhrGroup }),
    UsersService.fetchCurrentLoggedInUser(xhrGroup),
    ApplicationService.getVersion(xhrGroup)
  ])

  // TODO: This flag is for Side Nav testing. Remove when it's ramped.
  if (localStorage.SIDE_NAVIGATION) {
    featureFlag.SIDE_NAVIGATION = true
  }

  if (!accountError && !permissionsError && !featureFlagError && !userError && !versionError) {
    const appContextData = { activeAccount, permission, featureFlag, user, version }
    setAppContext(appContextData)

    // Update DataStore so it gets latest data from context
    // This is done to support legacy pages which still rely heavily on DataStore
    DataStore?.setDataFromAppContext(appContextData)
  } else {
    setAppContext({ applicationErrors: [accountError, permissionsError, featureFlagError, userError, versionError] })
  }

  // Add account type into body[data-account-type] (@see https://harness.atlassian.net/browse/PL-10186)
  document.body.dataset.accountType = (activeAccount?.licenseInfo?.accountType || '').toLowerCase()
}

/**
 * When a user navigates from a page to another, re-fetch some context data like permission
 * to get latest data. This is useful when they do some configuration, then go to another page
 * to verify if it got effected.
 */
async function refreshContextOnPageNavigation(accountId: string, setAppContext: AppContextSetter) {
  const { permissionData: permission, error } = await UsersService.getUserPermissions(accountId)

  if (error) {
    setAppContext({ applicationErrors: [error] })
  } else {
    setAppContext({ permission })
  }
}

/**
 * AppShell makes sure all the essential, common, shared entities like route, params, query params
 * account, user, permission... are available for pages and components.
 *
 * This architecture ensures when you develop a page, or a modal, or a banner, an entry
 * in the global application nav... You always have the information you need. The entities you
 * have in hands will are latest, non-nullable, and current to the URL location.
 *
 * Flows of AppShell:
 *  - If app is not initialized, start fetching shared entities.
 *  - If route is not available yet, wait until it's available.
 *  - When shared entities are not fetched yet, wait until they are fetched.
 *  - Actual pages/components are only rendered when data is ready.
 *  - When a page is navigated to, re-fetch required entities which need to be refreshed (now just permission).
 *  - When account is changed, re-init.
 *  - When logging out, reset application states.
 */
export default function AppShell({ children }) {
  const [isFetching, setIsFetching] = useState(false)
  const { setAppContext, activeAccount, route, initialized } = useAppContext()
  const hashListener = useRef<EventListenerOrEventListenerObject>()

  useEffect(() => {
    hashListener.current = function () {
      if (!/^#\/account\//i.test(location.hash)) {
        setAppContext({ ...initialAppContextInfo, initialized: false })
      }
    }

    addEventListener(PAGE_CHANGED_EVENT, hashListener.current)

    return () => {
      xhr.abort(xhrGroup)
      removeEventListener(PAGE_CHANGED_EVENT, hashListener.current!) // eslint-disable-line
    }
  }, [])

  useEffect(() => {
    if (!route) {
      return
    }

    const { accountId } = route.params

    if (!initialized) {
      const fetchData = async () => {
        setIsFetching(true)
        await fetchAppContextData(accountId, setAppContext)

        setAppContext({ initialized: true })
        setIsFetching(false)
      }
      fetchData()
    } else {
      // When account is changed, set initialized to false
      // to re-initialize the whole fetching process again
      if (activeAccount && activeAccount.uuid !== accountId) {
        setAppContext({ ...initialAppContextInfo, initialized: false })
      } else {
        refreshContextOnPageNavigation(accountId, setAppContext)
      }
    }
  }, [route])

  return (
    <>
      {isFetching && <RouteLoading />}
      {children}
    </>
  )
}
