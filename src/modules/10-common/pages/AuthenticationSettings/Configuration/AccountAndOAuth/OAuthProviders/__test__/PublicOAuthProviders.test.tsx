import React from 'react'
import { render, act, fireEvent, waitFor, queryByText, queryAllByText } from '@testing-library/react'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'
import { AuthenticationMechanisms } from '@common/constants/Utils'
import PublicOAuthProviders from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/OAuthProviders/PublicOAuthProviders'
import { mockResponse, authSettings } from '@common/pages/AuthenticationSettings/__test__/mock'

const refetchAuthSettings = jest.fn()

jest.mock('services/cd-ng', () => ({
  useUpdateOauthProviders: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  }),
  useUpdateAuthMechanism: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  }),
  useRemoveOauthMechanism: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  })
}))

const oneOauthEnabled = {
  ...authSettings,
  ngAuthSettings: [
    {
      allowedProviders: ['GITHUB'],
      settingsType: AuthenticationMechanisms.OAUTH
    }
  ]
}

const disabledOauthLogin = {
  ...authSettings,
  ngAuthSettings: authSettings.ngAuthSettings.filter(
    settings => settings.settingsType !== AuthenticationMechanisms.OAUTH
  )
}

describe('PublicOAuthProviders', () => {
  test('Disable OAuth Providers', async () => {
    const { getByTestId, container } = render(
      <TestWrapper path="/account/:accountId/admin/authentication/configuration" pathParams={{ accountId: 'testAcc' }}>
        <PublicOAuthProviders authSettings={authSettings} refetchAuthSettings={refetchAuthSettings} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    const toggleOAuthSwitch = getByTestId('toggle-oauth-providers')
    act(() => {
      fireEvent.click(toggleOAuthSwitch)
    })

    await waitFor(() => queryByText(document.body, 'common.authSettings.disableOAuthLogin'))
    const form = findDialogContainer()
    expect(form).toBeTruthy()

    const confirmBtn = queryByText(form!, 'confirm')
    await act(async () => {
      fireEvent.click(confirmBtn!)
    })

    expect(queryByText(document.body, 'common.authSettings.publicOAuthLoginDisabled')).toBeTruthy()
  }),
    test('Enable OAuth Providers', async () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <PublicOAuthProviders authSettings={disabledOauthLogin} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const toggleOAuthSwitch = getByTestId('toggle-oauth-providers')
      await act(async () => {
        fireEvent.click(toggleOAuthSwitch)
      })

      expect(queryByText(document.body, 'common.authSettings.publicOAuthLoginEnabled')).toBeTruthy()
    }),
    test('Update OAuth settings', () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <PublicOAuthProviders authSettings={authSettings} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const disableGithub = getByTestId('toggle-oauth-github')
      act(() => {
        fireEvent.click(disableGithub)
      })

      const enableGitlab = getByTestId('toggle-oauth-gitlab')
      act(() => {
        fireEvent.click(enableGitlab)
      })

      expect(queryAllByText(document.body, 'common.authSettings.oauthSettingsHaveBeenUpdated')).toBeTruthy()
    }),
    test('All oauth providers cannot be disabled, at least 1 is required', () => {
      const { getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/admin/authentication/configuration"
          pathParams={{ accountId: 'testAcc' }}
        >
          <PublicOAuthProviders authSettings={oneOauthEnabled} refetchAuthSettings={refetchAuthSettings} />
        </TestWrapper>
      )

      const toggleOAuthSwitch = getByTestId('toggle-oauth-github')
      act(() => {
        fireEvent.click(toggleOAuthSwitch)
      })

      expect(queryByText(document.body, 'common.authSettings.keepAtLeastOneProviderEnabled')).toBeTruthy()
    })
})
