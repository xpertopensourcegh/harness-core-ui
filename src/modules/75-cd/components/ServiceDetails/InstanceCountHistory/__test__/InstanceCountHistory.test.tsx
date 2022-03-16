/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cdngServices from 'services/cd-ng'
import { InstanceCountHistory } from '../InstanceCountHistory'

jest.mock('highcharts-react-official', () => () => <></>)
describe('InstanceCountHistory', () => {
  test('should render InstanceCountHistory', () => {
    jest.spyOn(cdngServices, 'useGetInstanceCountHistory').mockImplementation(() => {
      return {
        loading: false,
        error: false,
        data: {
          data: {
            timeValuePairList: [
              {
                timestamp: 10,
                value: {
                  count: 15,
                  envId: 'qa'
                }
              },
              {
                timestamp: 4,
                value: {
                  count: 5
                }
              },
              {
                timestamp: 5,
                value: {
                  count: 6,
                  envId: 'qa'
                }
              }
            ]
          }
        },
        refetch: jest.fn()
      } as any
    })
    const { container } = render(
      <TestWrapper>
        <InstanceCountHistory />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('should render InstanceCountHistory loading true', () => {
    jest.spyOn(cdngServices, 'useGetInstanceCountHistory').mockImplementation(() => {
      return { loading: true, error: false, data: [], refetch: jest.fn() } as any
    })
    const { container } = render(
      <TestWrapper>
        <InstanceCountHistory />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('should render InstanceCountHistory no data', () => {
    jest.spyOn(cdngServices, 'useGetInstanceCountHistory').mockImplementation(() => {
      return { loading: false, error: false, data: [], refetch: jest.fn() } as any
    })
    const { container } = render(
      <TestWrapper>
        <InstanceCountHistory />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('should render InstanceCountHistory error true', () => {
    jest.spyOn(cdngServices, 'useGetInstanceCountHistory').mockImplementation(() => {
      return { loading: false, error: true, data: [], refetch: jest.fn() } as any
    })
    const { container, getByText } = render(
      <TestWrapper>
        <InstanceCountHistory />
      </TestWrapper>
    )
    fireEvent.click(getByText('Retry'))
    expect(container).toMatchSnapshot()
  })
})
