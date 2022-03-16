/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cdngServices from 'services/cd-ng'
import { ServiceDetailsHeader } from '../ServiceDetailsHeader/ServiceDetailsHeader'

describe('ServiceDetailsHeader', () => {
  test('should render ServiceDetailsHeader', () => {
    jest.spyOn(cdngServices, 'useGetServiceHeaderInfo').mockImplementation(() => {
      return {
        loading: false,
        error: false,
        data: {
          data: {
            createdAt: 1644648631847,
            lastModifiedAt: 1644648631847,
            description: 'dmeo',
            identifier: 'dmeo',
            name: 'dmeo'
          }
        },
        refetch: jest.fn()
      } as any
    })
    const { container } = render(
      <TestWrapper>
        <ServiceDetailsHeader />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('render no data', () => {
    jest.spyOn(cdngServices, 'useGetServiceHeaderInfo').mockImplementation(() => {
      return { loading: false, error: false, data: [], refetch: jest.fn() } as any
    })
    const { container } = render(
      <TestWrapper>
        <ServiceDetailsHeader />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
