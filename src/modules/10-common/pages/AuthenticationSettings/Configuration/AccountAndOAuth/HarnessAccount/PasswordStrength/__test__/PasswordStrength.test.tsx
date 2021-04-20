import React from 'react'
import { render, act, fireEvent, waitFor, queryByText, queryAllByText } from '@testing-library/react'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'
import PasswordStrength from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/HarnessAccount/PasswordStrength/PasswordStrength'
import { mockResponse, loginSettings } from '@common/pages/AuthenticationSettings/__test__/mock'

const refetchAuthSettings = jest.fn()

jest.mock('services/cd-ng', () => ({
  updateLoginSettings: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  }),
  usePutLoginSettings: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  }),
  onSuccess: jest.fn()
}))

const disablePasswordSettings = {
  ...loginSettings,
  passwordStrengthPolicy: {
    ...loginSettings.passwordStrengthPolicy,
    enabled: false
  }
}

describe('PasswordStrength', () => {
  test('Disable password strength', async () => {
    const { getByTestId, container } = render(
      <TestWrapper path="/account/:accountId/admin/authentication/configuration" pathParams={{ accountId: 'testAcc' }}>
        <PasswordStrength loginSettings={loginSettings} refetchAuthSettings={refetchAuthSettings} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    const togglePasswordStrength = getByTestId('toggle-password-strength')
    act(() => {
      fireEvent.click(togglePasswordStrength)
    })

    await waitFor(() => queryByText(document.body, 'common.authSettings.disablePasswordStrength'))
    const confirmDisable = findDialogContainer()
    expect(confirmDisable).toBeTruthy()

    const confirmBtn = queryByText(confirmDisable!, 'confirm')
    await act(async () => {
      fireEvent.click(confirmBtn!)
    })

    expect(queryByText(document.body, 'common.authSettings.passwordStrengthDisabled')).toBeTruthy()
  }),
    test('Cancel enable password strength', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <PasswordStrength loginSettings={disablePasswordSettings} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const togglePasswordStrength = getByTestId('toggle-password-strength')
      act(() => {
        fireEvent.click(togglePasswordStrength)
      })

      await waitFor(() => queryByText(document.body, 'common.authSettings.passwordStrength'))
      const passwordStrengthForm = findDialogContainer()
      expect(passwordStrengthForm).toBeTruthy()

      const cancelButton = queryByText(passwordStrengthForm!, 'cancel')
      await act(async () => {
        fireEvent.click(cancelButton!)
      })

      expect(cancelButton).toMatchSnapshot()
    }),
    test('Enable password strength', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <PasswordStrength loginSettings={disablePasswordSettings} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const togglePasswordStrength = getByTestId('toggle-password-strength')
      act(() => {
        fireEvent.click(togglePasswordStrength)
      })

      await waitFor(() => queryByText(document.body, 'common.authSettings.passwordStrength'))
      const passwordStrengthForm = findDialogContainer()
      expect(passwordStrengthForm).toBeTruthy()

      const uppercaseCheckbox = queryByText(passwordStrengthForm!, 'common.authSettings.haveOneUppercase')
      const lowercaseCheckbox = queryByText(passwordStrengthForm!, 'common.authSettings.haveOneLowercase')
      const digitCheckbox = queryByText(passwordStrengthForm!, 'common.authSettings.haveOneDigit')
      const specialCharCheckbox = queryByText(passwordStrengthForm!, 'common.authSettings.haveOneSpecialChar')

      const saveButton = queryByText(passwordStrengthForm!, 'save')
      await act(async () => {
        fireEvent.click(uppercaseCheckbox!)
        fireEvent.click(lowercaseCheckbox!)
        fireEvent.click(digitCheckbox!)
        fireEvent.click(specialCharCheckbox!)
        fireEvent.click(saveButton!)
      })

      expect(queryAllByText(document.body, 'common.authSettings.passwordStrengthEnabled')).toBeTruthy()
    }),
    test('Update Password settings', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <PasswordStrength loginSettings={loginSettings} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const updatePasswordStrength = getByTestId('updatePasswordSettings')
      act(() => {
        fireEvent.click(updatePasswordStrength)
      })

      await waitFor(() => queryByText(document.body, 'common.authSettings.passwordStrength'))
      const passwordStrengthForm = findDialogContainer()
      expect(passwordStrengthForm).toBeTruthy()

      const saveButton = queryByText(passwordStrengthForm!, 'save')
      await act(async () => {
        fireEvent.click(saveButton!)
      })

      expect(queryAllByText(document.body, 'common.authSettings.passwordStrengthEnabled')).toBeTruthy()
    })
})
