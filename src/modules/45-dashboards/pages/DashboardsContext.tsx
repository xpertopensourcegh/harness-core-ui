/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import type { Breadcrumb } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import routes from '@common/RouteDefinitions'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'

export interface DashboardsContextProps {
  breadcrumbs: Breadcrumb[]
  includeBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}

const DashboardsContext = React.createContext<DashboardsContextProps>({} as DashboardsContextProps)

export function DashboardsContextProvider(props: React.PropsWithChildren<unknown>): React.ReactElement {
  const { getString } = useStrings()
  const { accountId } = useParams<AccountPathProps>()

  const standardBreadcrumbs: Breadcrumb[] = [
    {
      url: routes.toCustomDashboardHome({ accountId }),
      label: getString('common.dashboards')
    }
  ]
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>(standardBreadcrumbs)

  const includeBreadcrumbs = (breadcrumbsToAdd: Breadcrumb[]): void => {
    setBreadcrumbs([...standardBreadcrumbs, ...breadcrumbsToAdd])
  }

  return (
    <DashboardsContext.Provider
      value={{
        breadcrumbs,
        includeBreadcrumbs
      }}
    >
      {props.children}
    </DashboardsContext.Provider>
  )
}

export function useDashboardsContext(): DashboardsContextProps {
  return useContext(DashboardsContext)
}
