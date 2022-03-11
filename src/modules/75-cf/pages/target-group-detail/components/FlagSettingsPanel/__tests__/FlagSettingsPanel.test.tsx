/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

/* eslint-disable react/display-name */
import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import * as cfServices from 'services/cf'
import FlagSettingsPanel, { FlagSettingsPanelProps } from '../FlagSettingsPanel'
import { mockFeatures, mockSegmentFlags, mockTargetGroup } from './mocks'

jest.mock('../FlagSettingsForm', () => ({
  __esModule: true,
  default: () => <span data-testid="flag-settings-form">Flag Settings Form</span>
}))

jest.mock('@common/components/ContainerSpinner/ContainerSpinner', () => ({
  ContainerSpinner: () => <span data-testid="container-spinner">Container Spinner</span>
}))

const renderComponent = (props: Partial<FlagSettingsPanelProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <FlagSettingsPanel targetGroup={mockTargetGroup} {...props} />
    </TestWrapper>
  )

describe('FlagSettingsPanel', () => {
  const getSegmentFlagsMock = jest.spyOn(cfServices, 'useGetSegmentFlags')
  const getAllFeaturesMock = jest.spyOn(cfServices, 'useGetAllFeatures')

  beforeEach(() => {
    jest.resetAllMocks()

    getSegmentFlagsMock.mockReturnValue({
      data: mockSegmentFlags,
      loading: false,
      error: null,
      refetch: jest.fn()
    } as any)

    getAllFeaturesMock.mockReturnValue({
      data: { features: mockFeatures },
      loading: false,
      error: null,
      refetch: jest.fn()
    } as any)
  })

  test('it should display the loading indicator when the segment flags are loading', async () => {
    getSegmentFlagsMock.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    } as any)

    renderComponent()

    expect(screen.getByTestId('container-spinner')).toBeInTheDocument()
  })

  test('it should display the error message when an error occurs', async () => {
    const message = 'TEST ERROR'
    const refetchMock = jest.fn()

    getSegmentFlagsMock.mockReturnValue({
      data: null,
      loading: false,
      error: { message },
      refetch: refetchMock
    } as any)

    renderComponent()

    expect(screen.getByText(message)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(refetchMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    await waitFor(() => expect(refetchMock).toHaveBeenCalled())
  })

  test('it should display the form when there are flags to display', async () => {
    renderComponent()

    expect(screen.getByTestId('flag-settings-form')).toBeInTheDocument()
  })

  test('it should display the empty state screen when there are no flags to display', async () => {
    getSegmentFlagsMock.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: jest.fn()
    } as any)

    renderComponent()

    expect(screen.queryByTestId('flag-settings-form')).not.toBeInTheDocument()
    expect(screen.getByText('cf.segmentDetail.noFlags')).toBeInTheDocument()
  })
})
