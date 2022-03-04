/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import React from 'react'
import { TestWrapper } from '@common/utils/testUtils'
import mockFeature from '@cf/utils/testData/data/mockFeature'
import type { TargetingRulesTabProps } from '../TargetingRulesTab'
import TargetingRulesTab from '../TargetingRulesTab'
import * as usePatchFeatureFlagMock from '../hooks/usePatchFeatureFlag'

const renderComponent = (props: Partial<TargetingRulesTabProps> = {}): void => {
  render(
    <TestWrapper
      path="/account/:accountId/cf/orgs/:orgIdentifier/projects/:projectIdentifier/feature-flags"
      pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
    >
      <TargetingRulesTab featureFlagData={mockFeature} refetchFlag={jest.fn()} refetchFlagLoading={false} {...props} />
    </TestWrapper>
  )
}

describe('TargetingRulesTab', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('it should render form with correct values based on load', async () => {
    renderComponent()

    expect(screen.getByText('cf.featureFlags.flagOn')).toBeInTheDocument()
    expect(screen.getByTestId('flag-status-switch')).toBeChecked()
    expect(document.querySelector('input[name="onVariation"]')).toHaveValue('False')

    expect(screen.queryByTestId('targeting-rules-footer')).not.toBeInTheDocument()
  })

  test('it should toggle flag state from ON to OFF correctly', async () => {
    renderComponent()

    const flagToggle = screen.getByTestId('flag-status-switch')
    expect(flagToggle).toBeChecked()

    userEvent.click(flagToggle)

    expect(flagToggle).not.toBeChecked()
    expect(screen.getByText('cf.featureFlags.flagWillTurnOff')).toBeInTheDocument()
  })

  test('it should toggle flag state from OFF to ON correctly', async () => {
    renderComponent({
      featureFlagData: {
        ...mockFeature,
        envProperties: {
          defaultServe: { variation: 'false' },
          environment: 'testnonprod',
          modifiedAt: 1635333973373,
          offVariation: 'false',
          rules: [],
          state: 'off',
          variationMap: [],
          version: 56
        }
      }
    })

    const flagToggle = screen.getByTestId('flag-status-switch')
    expect(flagToggle).not.toBeChecked()

    userEvent.click(flagToggle)

    expect(flagToggle).toBeChecked()
    expect(screen.getByText('cf.featureFlags.flagWillTurnOn')).toBeInTheDocument()

    expect(screen.queryByTestId('targeting-rules-footer')).toBeInTheDocument()
  })

  test('it should update default ON variation correctly', async () => {
    renderComponent()

    const onVariationDropdown = document.querySelector('input[name="onVariation"]') as HTMLSelectElement
    expect(onVariationDropdown).toHaveValue('False')
    userEvent.click(onVariationDropdown)
    userEvent.click(screen.getByText('True'))
    expect(onVariationDropdown).toHaveValue('True')
  })

  test('it should use default onVariation if environment variation does not exist', async () => {
    renderComponent({
      featureFlagData: {
        ...mockFeature,
        envProperties: undefined
      }
    })

    expect(document.querySelector('input[name="onVariation"]') as HTMLSelectElement).toHaveValue('True')
  })

  test('it should call endpoint with correct data on save', async () => {
    const saveChangesMock = jest.fn()

    jest.spyOn(usePatchFeatureFlagMock, 'default').mockReturnValue({ saveChanges: saveChangesMock, loading: false })
    renderComponent()

    // toggle flag off
    const flagToggle = screen.getByTestId('flag-status-switch')
    userEvent.click(flagToggle)
    expect(flagToggle).not.toBeChecked()

    // update default ON variation
    const onVariationDropdown = document.querySelector('input[name="onVariation"]') as HTMLSelectElement
    userEvent.click(onVariationDropdown)
    userEvent.click(screen.getByText('True'))
    expect(onVariationDropdown).toHaveValue('True')

    // click save
    const saveButton = screen.getByText('save')
    expect(saveButton).toBeInTheDocument()

    userEvent.click(saveButton)
    await waitFor(() =>
      expect(saveChangesMock).toBeCalledWith({
        onVariation: 'true',
        state: 'off'
      })
    )
  })

  test('it should reset form correctly when cancel button clicked', async () => {
    renderComponent()

    const flagToggle = screen.getByTestId('flag-status-switch')
    expect(flagToggle).toBeChecked()
    userEvent.click(flagToggle)
    expect(flagToggle).not.toBeChecked()

    const cancelButton = screen.getByText('cancel')
    expect(cancelButton).toBeInTheDocument()

    userEvent.click(cancelButton)
    expect(flagToggle).toBeChecked()
  })
})
