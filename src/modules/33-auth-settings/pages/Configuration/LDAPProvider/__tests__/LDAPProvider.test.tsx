/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { AuthenticationSettingsResponse } from 'services/cd-ng'
import * as cdngServices from 'services/cd-ng'
import LDAPProvider from '../LDAPProvider'
import { mockAuthSettingsResponse, permissionRequest } from './mock'

const refetchAuthSettings = jest.fn()
const mockDispatch = jest.fn()
const mockGroupSync = jest.fn().mockReturnValue(Promise.resolve(true))
const mockLdapLoginTest = jest.fn().mockReturnValue(
  Promise.resolve({
    resource: {
      status: 'SUCCESS'
    }
  })
)
const mockLdapLoginTestFail = jest.fn().mockReturnValue(
  Promise.resolve({
    resource: {
      status: 'FAILURE',
      message: 'Invalid Credentials'
    }
  })
)

const mockLdapLoginDelegateFailure = jest.fn().mockReturnValue(
  Promise.resolve({
    resource: {
      status: 'FAILURE',
      message: 'Delegate not found'
    }
  })
)
const mockUpdateAuthMechanism = jest.fn().mockReturnValue(
  Promise.resolve({
    resource: {
      status: 'SUCCESS'
    }
  })
)
const mockUpdateAuthMechanismFailure = jest.fn().mockReturnValue(
  Promise.resolve({
    responseMessages: [
      {
        message: 'Not Allowed'
      }
    ]
  })
)

describe('LDAP Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('LDAP Provider Snapshot', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('LDAP Provider Snapshot with no data', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={[] as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('LDAP Provider delete', async () => {
    jest
      .spyOn(cdngServices, 'useDeleteLdapSettings')
      .mockReturnValue({ mutate: jest.fn(() => Promise.resolve(true)) } as any)
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )
    const ldapPopoverEl = getByTestId('provider-button')
    expect(ldapPopoverEl).not.toBeNull()
    act(() => {
      ldapPopoverEl && fireEvent.click(ldapPopoverEl)
    })
    await waitFor(() => getByTestId('ldap-popover-menu'))
    const deleteConfigBtn = getByTestId('ldap-delete-config')
    expect(deleteConfigBtn).not.toBeNull()

    await act(async () => {
      deleteConfigBtn && fireEvent.click(deleteConfigBtn)
    })
    await waitFor(() => getByText('confirm'))
    const confirmDeleteBtn = getByText('confirm')
    await act(async () => {
      confirmDeleteBtn && fireEvent.click(confirmDeleteBtn)
    })
    await waitFor(() => getByText('authSettings.ldapProviderDeleted'))
  })
  test('LDAP Provider enable config', async () => {
    jest.spyOn(cdngServices, 'usePostLdapLoginTest').mockImplementation(
      () =>
        ({
          mutate: mockLdapLoginTest
        } as any)
    )
    jest.spyOn(cdngServices, 'useUpdateAuthMechanism').mockImplementation(
      () =>
        ({
          mutate: mockUpdateAuthMechanism
        } as any)
    )
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )

    const testConfigBtn = getByTestId('ldap-config-test')
    act(() => {
      testConfigBtn && fireEvent.click(testConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.verifyAndEnableConfig')).not.toBeNull())
    const enableLdapConfigBtn = getByTestId('enable-ldap-config')
    await act(async () => {
      enableLdapConfigBtn && fireEvent.click(enableLdapConfigBtn)
    })
    const emailField = document.querySelector('[name="email"]')
    const passwordField = document.querySelector('[name="password"]')
    await act(async () => {
      emailField && fireEvent.change(emailField, { target: { value: 'test@harness.io' } })
      passwordField && fireEvent.change(passwordField, { target: { value: 'test@1234' } })
    })
    await act(async () => {
      enableLdapConfigBtn && fireEvent.click(enableLdapConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.authChangeSuccessful')).not.toBeNull())
  })
  test('LDAP Provider enable config test failure', async () => {
    jest.spyOn(cdngServices, 'usePostLdapLoginTest').mockImplementation(
      () =>
        ({
          mutate: mockLdapLoginDelegateFailure
        } as any)
    )
    jest.spyOn(cdngServices, 'useUpdateAuthMechanism').mockImplementation(
      () =>
        ({
          mutate: mockUpdateAuthMechanism
        } as any)
    )
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )

    const testConfigBtn = getByTestId('ldap-config-test')
    act(() => {
      testConfigBtn && fireEvent.click(testConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.verifyAndEnableConfig')).not.toBeNull())
    const enableLdapConfigBtn = getByTestId('enable-ldap-config')
    await act(async () => {
      enableLdapConfigBtn && fireEvent.click(enableLdapConfigBtn)
    })
    const emailField = document.querySelector('[name="email"]')
    const passwordField = document.querySelector('[name="password"]')
    await act(async () => {
      emailField && fireEvent.change(emailField, { target: { value: 'test@harness.io' } })
      passwordField && fireEvent.change(passwordField, { target: { value: 'test@1234' } })
    })
    await act(async () => {
      enableLdapConfigBtn && fireEvent.click(enableLdapConfigBtn)
    })
    await waitFor(() => expect(getByText('Delegate not found')).not.toBeNull())
  })
  test('LDAP Provider enable config auth failure', async () => {
    jest.spyOn(cdngServices, 'usePostLdapLoginTest').mockImplementation(
      () =>
        ({
          mutate: mockLdapLoginTest
        } as any)
    )
    jest.spyOn(cdngServices, 'useUpdateAuthMechanism').mockImplementation(
      () =>
        ({
          mutate: mockUpdateAuthMechanismFailure
        } as any)
    )
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )

    const testConfigBtn = getByTestId('ldap-config-test')
    act(() => {
      testConfigBtn && fireEvent.click(testConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.verifyAndEnableConfig')).not.toBeNull())
    const enableLdapConfigBtn = getByTestId('enable-ldap-config')
    await act(async () => {
      enableLdapConfigBtn && fireEvent.click(enableLdapConfigBtn)
    })
    const emailField = document.querySelector('[name="email"]')
    const passwordField = document.querySelector('[name="password"]')
    await act(async () => {
      emailField && fireEvent.change(emailField, { target: { value: 'test@harness.io' } })
      passwordField && fireEvent.change(passwordField, { target: { value: 'test@1234' } })
    })
    await act(async () => {
      enableLdapConfigBtn && fireEvent.click(enableLdapConfigBtn)
    })
    await waitFor(() => expect(getByText('Not Allowed')).not.toBeNull())
  })
  test('LDAP Provider test config', async () => {
    jest.spyOn(cdngServices, 'usePostLdapLoginTest').mockImplementation(
      () =>
        ({
          mutate: mockLdapLoginTest
        } as any)
    )
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )

    const testConfigBtn = getByTestId('ldap-config-test')
    act(() => {
      testConfigBtn && fireEvent.click(testConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.verifyAndEnableConfig')).not.toBeNull())
    const testLdapConfigBtn = getByTestId('test-ldap-config')

    const emailField = document.querySelector('[name="email"]')
    const passwordField = document.querySelector('[name="password"]')
    await act(async () => {
      emailField && fireEvent.change(emailField, { target: { value: 'test@harness.io' } })
      passwordField && fireEvent.change(passwordField, { target: { value: 'test@1234' } })
    })
    await act(async () => {
      testLdapConfigBtn && fireEvent.click(testLdapConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.ldapTestSuccessful')).not.toBeNull())
  })
  test('LDAP Provider test config fail', async () => {
    jest.spyOn(cdngServices, 'usePostLdapLoginTest').mockImplementation(
      () =>
        ({
          mutate: mockLdapLoginTestFail
        } as any)
    )
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )

    const testConfigBtn = getByTestId('ldap-config-test')
    act(() => {
      testConfigBtn && fireEvent.click(testConfigBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.verifyAndEnableConfig')).not.toBeNull())
    const testLdapConfigBtn = getByTestId('test-ldap-config')

    const emailField = document.querySelector('[name="email"]')
    const passwordField = document.querySelector('[name="password"]')
    await act(async () => {
      emailField && fireEvent.change(emailField, { target: { value: 'test@harness.io' } })
      passwordField && fireEvent.change(passwordField, { target: { value: 'test@1234' } })
    })
    await act(async () => {
      testLdapConfigBtn && fireEvent.click(testLdapConfigBtn)
    })
    await waitFor(() => expect(getByText('Invalid Credentials')).not.toBeNull())
  })
  test('LDAP Provider group sync', async () => {
    jest.spyOn(cdngServices, 'syncLdapGroupsPromise').mockImplementation(() => mockGroupSync())
    const { getByTestId, getByText } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc' }} defaultFeatureFlagValues={{ NG_ENABLE_LDAP_CHECK: true }}>
        <LDAPProvider
          authSettings={mockAuthSettingsResponse as AuthenticationSettingsResponse}
          canEdit={true}
          refetchAuthSettings={refetchAuthSettings}
          permissionRequest={permissionRequest}
          setUpdating={mockDispatch}
        />
      </TestWrapper>
    )
    const ldapPopoverEl = getByTestId('provider-button')
    expect(ldapPopoverEl).not.toBeNull()
    act(() => {
      ldapPopoverEl && fireEvent.click(ldapPopoverEl)
    })

    const triggerGroupSyncBtn = getByTestId('ldap-group-sync')
    expect(triggerGroupSyncBtn).not.toBeNull()
    act(() => {
      triggerGroupSyncBtn && fireEvent.click(triggerGroupSyncBtn)
    })
    await waitFor(() => expect(getByText('authSettings.ldap.syncUserGroupsResult.fail')).not.toBeNull())
  })
})
