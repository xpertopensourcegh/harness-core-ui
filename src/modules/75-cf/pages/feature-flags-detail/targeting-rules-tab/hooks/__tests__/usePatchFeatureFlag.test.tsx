/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { renderHook } from '@testing-library/react-hooks'
import type { FC } from 'react'
import React from 'react'
import { waitFor, screen } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cfServicesMock from 'services/cf'
import usePatchFeatureFlag, { UsePatchFeatureFlagProps } from '../usePatchFeatureFlag'

const renderHookUnderTest = (props: Partial<UsePatchFeatureFlagProps> = {}) => {
  const wrapper: FC = ({ children }) => {
    return (
      <TestWrapper
        path="/account/:accountId/cf/orgs/:orgIdentifier/projects/:projectIdentifier/feature-flags"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        {children}
      </TestWrapper>
    )
  }

  return renderHook(
    () =>
      usePatchFeatureFlag({
        featureFlagIdentifier: '',
        initialValues: { state: 'off', onVariation: 'False' },
        refetchFlag: jest.fn(),
        ...props
      }),
    { wrapper }
  )
}

describe('usePatchFeatureFlag', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('it should handle saveChanges correctly when values different', async () => {
    const refetchFlagMock = jest.fn()
    const mutateMock = jest.fn()
    jest
      .spyOn(cfServicesMock, 'usePatchFeature')
      .mockReturnValue({ mutate: mutateMock.mockResolvedValueOnce({}), cancel: jest.fn(), error: null, loading: false })

    const { result } = renderHookUnderTest({ refetchFlag: refetchFlagMock.mockResolvedValueOnce({}) })

    const newValues = { state: 'on', onVariation: 'True' }
    result.current.saveChanges(newValues)

    expect(mutateMock).toBeCalledWith({
      instructions: [
        {
          kind: 'setFeatureFlagState',
          parameters: {
            state: 'on'
          }
        },
        {
          kind: 'updateDefaultServe',
          parameters: {
            variation: 'True'
          }
        }
      ]
    })

    await waitFor(() => expect(screen.getByText('cf.messages.flagUpdated')).toBeInTheDocument())
    expect(refetchFlagMock).toBeCalled()
  })

  test('it should handle saveChanges correctly when values are the same', async () => {
    const refetchFlagMock = jest.fn()
    const mutateMock = jest.fn()
    jest
      .spyOn(cfServicesMock, 'usePatchFeature')
      .mockReturnValue({ mutate: mutateMock.mockResolvedValueOnce({}), cancel: jest.fn(), error: null, loading: false })

    const { result } = renderHookUnderTest({ refetchFlag: refetchFlagMock.mockResolvedValueOnce({}) })

    const newValues = { state: 'off', onVariation: 'False' }
    result.current.saveChanges(newValues)

    expect(mutateMock).not.toBeCalledWith()
    expect(refetchFlagMock).not.toBeCalled()
  })

  test('it should handle exception and show toast correctly', async () => {
    const mutateMock = jest.fn()
    jest.spyOn(cfServicesMock, 'usePatchFeature').mockReturnValue({
      mutate: mutateMock.mockRejectedValueOnce({ data: { message: 'ERROR FROM MOCK' } }),
      cancel: jest.fn(),
      error: null,
      loading: false
    })

    const { result } = renderHookUnderTest()

    const newValues = { state: 'on', onVariation: 'True' }
    result.current.saveChanges(newValues)

    await waitFor(() => expect(screen.getByText('ERROR FROM MOCK')).toBeInTheDocument())
  })
})
