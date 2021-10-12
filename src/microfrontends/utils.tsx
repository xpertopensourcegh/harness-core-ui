import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { useLocation } from 'react-router-dom'

import { PermissionsContext } from '../framework/rbac/PermissionsContext'
import { LicenseStoreContext } from '../framework/LicenseStore/LicenseStoreContext'
import { AppStoreContext } from '../framework/AppStore/AppStoreContext'

import type { RenderChildAppProps } from './microfrontendTypes'

export interface ChildAppMounterProps extends React.HTMLProps<HTMLDivElement> {
  mount: (props: RenderChildAppProps) => void
}

export function ChildAppMounter(props: ChildAppMounterProps): React.ReactElement {
  const { mount, ...rest } = props
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const { pathname } = useLocation()

  React.useEffect(() => {
    const mountPoint = rootRef.current
    if (mountPoint) {
      mount({
        mountPoint,
        renderUrl: pathname,
        parentContextObj: {
          appStoreContext: AppStoreContext,
          permissionsContext: PermissionsContext,
          licenseStoreProvider: LicenseStoreContext
        }
      })
    }

    return () => {
      if (mountPoint) {
        unmountComponentAtNode(mountPoint)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div {...rest} ref={rootRef} />
}
