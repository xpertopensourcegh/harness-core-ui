/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import BIDashboard from '../BIDashboard'
import BIDashboardData from './BIDashboardData.json'

jest.mock('services/ce', () => ({
  useListBIDashboards: jest.fn().mockImplementation(() => {
    return {
      data: BIDashboardData,
      refetch: jest.fn(),
      loading: false
    }
  })
}))

describe('Test cases for BI Dashboard page', () => {
  test('Should render the list of dashboard', () => {
    const { container, getByText } = render(
      <TestWrapper>
        <BIDashboard />
      </TestWrapper>
    )

    expect(getByText('ce.biDashboard.bannerText')).toBeDefined()

    expect(container).toMatchSnapshot()
  })
})
