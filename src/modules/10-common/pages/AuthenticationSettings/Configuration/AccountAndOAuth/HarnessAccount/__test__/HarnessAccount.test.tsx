import React from 'react'
import { render, act, fireEvent, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'
import { AuthenticationMechanisms } from '@common/constants/Utils'
import HarnessAccount from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/HarnessAccount/HarnessAccount'
import { mockResponse, authSettings } from '@common/pages/AuthenticationSettings/__test__/mock'

const refetchAuthSettings = jest.fn()

jest.mock('services/cd-ng', () => ({
  useUpdateAuthMechanism: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  }),
  usePutLoginSettings: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  })
}))

const disabledUserPasswordLogin = {
  ...authSettings,
  authenticationMechanism: AuthenticationMechanisms.OAUTH
}

const disabledOauthLogin = {
  ...authSettings,
  ngAuthSettings: authSettings.ngAuthSettings.filter(
    settings => settings.settingsType !== AuthenticationMechanisms.OAUTH
  )
}

describe('HarnessAccount', () => {
  test('Disable login vai Username-Password', async () => {
    const { getByTestId, container } = render(
      <TestWrapper path="/account/:accountId/admin/authentication/configuration" pathParams={{ accountId: 'testAcc' }}>
        <HarnessAccount authSettings={authSettings} refetchAuthSettings={refetchAuthSettings} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    const toggleUserPasswordLogin = getByTestId('toggle-user-password-login')
    act(() => {
      fireEvent.click(toggleUserPasswordLogin)
    })

    await waitFor(() => queryByText(document.body, 'common.authSettings.disableUserPasswordLogin'))
    const confirmDisable = findDialogContainer()
    expect(confirmDisable).toBeTruthy()

    const confirmBtn = queryByText(confirmDisable!, 'confirm')
    await act(async () => {
      fireEvent.click(confirmBtn!)
    })

    expect(queryByText(document.body, 'common.authSettings.loginSettingsHaveBeenUpdated')).toBeTruthy()
  }),
    test('Enable login vai Username-Password', () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <HarnessAccount authSettings={disabledUserPasswordLogin} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const toggleUserPasswordLogin = getByTestId('toggle-user-password-login')
      act(() => {
        fireEvent.click(toggleUserPasswordLogin)
      })

      expect(queryByText(document.body, 'common.authSettings.loginSettingsHaveBeenUpdated')).toBeTruthy()
    }),
    test('Enable at least one SSO before disabling login vai Username-Password', () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <HarnessAccount authSettings={disabledOauthLogin} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const toggleUserPasswordLogin = getByTestId('toggle-user-password-login')
      act(() => {
        fireEvent.click(toggleUserPasswordLogin)
      })

      expect(
        queryByText(document.body, 'common.authSettings.enableAtLeastOneSSoBeforeDisablingUserPasswordLogin')
      ).toBeTruthy()
    })
})
