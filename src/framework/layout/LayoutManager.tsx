import React, { useEffect, useState } from 'react'
import type { Route } from 'framework/exports'
import { useAppStoreWriter } from 'framework/hooks/useAppStore'
import { sidebarRegistry } from 'framework/registry'
import { AppEssentials } from 'framework/app/AppEssentials'
import { useToaster } from '@common/exports'
import { PageLayout } from './PageLayout'

/**
 * LayoutManger handles page layout. It's responsible for composing
 * the right Layout for a page when a route is mounted.
 */
export const LayoutManager: React.FC<{ route?: Route }> = ({ children, route }) => {
  const updateApplicationStore = useAppStoreWriter()
  const LayoutComponent = route && ((route?.layout || PageLayout.DefaultLayout) as React.ElementType)
  const [mounted, setMounted] = useState(false)
  const isAuthRoute = route?.authenticated !== false
  const [fetchingEssentials, setFetchingEssentials] = useState(isAuthRoute)
  const { showError } = useToaster()

  useEffect(() => {
    if (!mounted) {
      updateApplicationStore({ sidebarRegistry: sidebarRegistry })
      setMounted(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!mounted ? null : fetchingEssentials ? (
        <AppEssentials
          onSuccess={({ projects, organisationsMap, user }) => {
            setFetchingEssentials(false)
            updateApplicationStore({ projects, organisationsMap, user })
          }}
          onError={error => {
            showError(error?.message)
          }}
        />
      ) : LayoutComponent ? (
        <LayoutComponent>{children}</LayoutComponent>
      ) : (
        children
      )}
    </>
  )
}
