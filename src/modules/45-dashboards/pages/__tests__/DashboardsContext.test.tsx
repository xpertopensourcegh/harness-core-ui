/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { DashboardsContextProvider, useDashboardsContext } from '../DashboardsContext'

describe('DashboardsContext', () => {
  test('it should provide default breadcrumbs', async () => {
    const wrapper = ({ children }: React.PropsWithChildren<unknown>) => (
      <TestWrapper path={routes.toCustomDashboardHome({ accountId: '1234' })} pathParams={{ accountId: '1234' }}>
        <DashboardsContextProvider>{children}</DashboardsContextProvider>
      </TestWrapper>
    )

    const { result } = renderHook(() => useDashboardsContext(), { wrapper })

    const expected = { label: 'common.dashboards', url: '/account/undefined/home/dashboards/folder/shared' }
    await waitFor(() => expect(result.current.breadcrumbs).toContainEqual(expected))
  })
})
