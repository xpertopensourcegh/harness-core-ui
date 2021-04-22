import React from 'react'
import { render, act, fireEvent, waitFor, queryByText, queryAllByText } from '@testing-library/react'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'
import PasswordExpire from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/HarnessAccount/PasswordExpire/PasswordExpire'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { mockResponse, loginSettings } from '@common/pages/AuthenticationSettings/__test__/mock'

jest.mock('services/cd-ng', () => ({
  updateLoginSettings: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  }),
  usePutLoginSettings: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  })
}))

const refetchAuthSettings = jest.fn()

const disablePasswordExpire = {
  ...loginSettings,
  passwordExpirationPolicy: {
    ...loginSettings.passwordExpirationPolicy,
    enabled: false
  }
}

describe('PasswordExpire', () => {
  test('Disable password Expire', async () => {
    const { getByTestId, container } = render(
      <TestWrapper
        path={routes.toAuthenticationSettings({ ...accountPathProps })}
        pathParams={{ accountId: 'testAcc' }}
      >
        <PasswordExpire loginSettings={loginSettings} refetchAuthSettings={refetchAuthSettings} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    const togglePasswordExpire = getByTestId('toggle-password-expire')
    act(() => {
      fireEvent.click(togglePasswordExpire)
    })

    await waitFor(() => queryByText(document.body, 'common.authSettings.disablePasswordExpiration'))
    const confirmDisable = findDialogContainer()
    expect(confirmDisable).toBeTruthy()

    const confirmBtn = queryByText(confirmDisable!, 'confirm')
    await act(async () => {
      fireEvent.click(confirmBtn!)
    })

    expect(queryByText(document.body, 'common.authSettings.passwordExpirationDisabled')).toBeTruthy()
  }),
    test('Cancel enable password Expire', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path={routes.toAuthenticationSettings({ ...accountPathProps })}
          pathParams={{ accountId: 'testAcc' }}
        >
          <PasswordExpire loginSettings={disablePasswordExpire} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const togglePasswordExpire = getByTestId('toggle-password-expire')
      act(() => {
        fireEvent.click(togglePasswordExpire)
      })

      await waitFor(() => queryByText(document.body, 'common.authSettings.passwordExpiration'))
      const passwordExpireForm = findDialogContainer()
      expect(passwordExpireForm).toBeTruthy()

      const cancelButton = queryByText(passwordExpireForm!, 'cancel')
      await act(async () => {
        fireEvent.click(cancelButton!)
      })

      expect(cancelButton).toMatchSnapshot()
    }),
    test('Enable password Expire', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path={routes.toAuthenticationSettings({ ...accountPathProps })}
          pathParams={{ accountId: 'testAcc' }}
        >
          <PasswordExpire loginSettings={disablePasswordExpire} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const togglePasswordExpire = getByTestId('toggle-password-expire')
      act(() => {
        fireEvent.click(togglePasswordExpire)
      })

      await waitFor(() => queryByText(document.body, 'common.authSettings.passwordExpiration'))
      const passwordExpireForm = findDialogContainer()
      expect(passwordExpireForm).toBeTruthy()

      const saveButton = queryByText(passwordExpireForm!, 'save')
      await act(async () => {
        fireEvent.click(saveButton!)
      })

      expect(queryAllByText(document.body, 'common.authSettings.passwordExpirationEnabled')).toBeTruthy()
    }),
    test('Update PasswordExpire settings', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path={routes.toAuthenticationSettings({ ...accountPathProps })}
          pathParams={{ accountId: 'testAcc' }}
        >
          <PasswordExpire loginSettings={loginSettings} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const updatePasswordExpire = getByTestId('update-password-expire-settings')
      act(() => {
        fireEvent.click(updatePasswordExpire)
      })

      await waitFor(() => queryByText(document.body, 'common.authSettings.passwordExpiration'))
      const passwordExpireForm = findDialogContainer()
      expect(passwordExpireForm).toBeTruthy()

      const saveButton = queryByText(passwordExpireForm!, 'save')
      await act(async () => {
        fireEvent.click(saveButton!)
      })

      expect(queryAllByText(document.body, 'common.authSettings.passwordExpirationEnabled')).toBeTruthy()
    })
})
