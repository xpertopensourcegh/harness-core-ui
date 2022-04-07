/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import GCOErrorAndLoading from '../MetricErrorAndLoading'
describe('GCOErrorAndLoading', () => {
  test('should render when loadingDashBoardData false', () => {
    const { container } = render(
      <TestWrapper>
        <GCOErrorAndLoading isEmpty={true} loading={false} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should render when loadingDashBoardData true', () => {
    const { container } = render(
      <TestWrapper>
        <GCOErrorAndLoading isEmpty={true} loading={true} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should render when loadingDashBoardData true', () => {
    const { container } = render(
      <TestWrapper>
        <GCOErrorAndLoading isEmpty={false} loading={false} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})