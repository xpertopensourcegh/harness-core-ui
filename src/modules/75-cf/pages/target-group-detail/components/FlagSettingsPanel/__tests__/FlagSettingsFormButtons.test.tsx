/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import FlagSettingsFormButtons, { FlagSettingsFormButtonsProps } from '../FlagSettingsFormButtons'

const renderComponent = (props: Partial<FlagSettingsFormButtonsProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <FlagSettingsFormButtons submitting={false} onSubmit={jest.fn()} onCancel={jest.fn()} {...props} />
    </TestWrapper>
  )

describe('FlagSettingsFormButtons', () => {
  test('it should disable both buttons and display a spinner when submitting is true', async () => {
    renderComponent({ submitting: true })

    expect(screen.getByRole('button', { name: 'saveChanges' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeDisabled()
    expect(screen.getByTestId('saving-spinner')).toBeInTheDocument()
  })

  test('it should enable both buttons and not display a spinner when submitting is false', async () => {
    renderComponent({ submitting: false })

    expect(screen.getByRole('button', { name: 'saveChanges' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeEnabled()
    expect(screen.queryByTestId('saving-spinner')).not.toBeInTheDocument()
  })

  test('it should call the onSubmit callback when the submit button is pressed', async () => {
    const onSubmitMock = jest.fn()
    renderComponent({ onSubmit: onSubmitMock })

    expect(onSubmitMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button', { name: 'saveChanges' }))

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalled())
  })

  test('it should call the onCancel callback when the cancel button is pressed', async () => {
    const onCancelMock = jest.fn()
    renderComponent({ onCancel: onCancelMock })

    expect(onCancelMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('button', { name: 'cancel' }))

    await waitFor(() => expect(onCancelMock).toHaveBeenCalled())
  })
})
