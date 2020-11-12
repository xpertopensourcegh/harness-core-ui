import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { noop } from 'lodash-es'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'

import { fillAtForm, InputTypes, clickSubmit } from '@common/utils/JestFormHelper'
import { NotificationType } from '@notifications/interfaces/Notifications'
import ConfigureEmailNotifications from '../views/ConfigureEmailNotifications/ConfigureEmailNotifications'
import ConfigureSlackNotifications from '../views/ConfigureSlackNotifications/ConfigureSlackNotifications'
import ConfigurePagerDutyNotifications from '../views/ConfigurePagerDutyNotifications/ConfigurePagerDutyNotifications'

const testNotification = jest.fn()
jest.mock('services/notifications', () => ({
  useTestNotificationSetting: jest.fn().mockImplementation(() => ({ mutate: testNotification }))
}))

describe('ConfigureNotifications', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Email', async () => {
    const handleSuccess = jest.fn()

    const { container } = render(
      <TestWrapper path="/account/:accountId/test" pathParams={{ accountId: 'dummy' }}>
        <ConfigureEmailNotifications hideModal={noop} onSuccess={handleSuccess} />
      </TestWrapper>
    )

    fillAtForm([
      {
        container,
        fieldId: 'emailIds',
        type: InputTypes.TEXTAREA,
        value: 'test@harness.io'
      }
    ])

    expect(container).toMatchSnapshot()

    clickSubmit(container)
    await waitFor(() =>
      expect(handleSuccess).toHaveBeenCalledWith({
        type: NotificationType.Email,
        emailIds: ['test@harness.io'],
        userGroups: []
      })
    )
  })

  test('Slack', async () => {
    const handleSuccess = jest.fn()

    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/test" pathParams={{ accountId: 'dummy' }}>
        <ConfigureSlackNotifications hideModal={noop} onSuccess={handleSuccess} />
      </TestWrapper>
    )

    fillAtForm([
      {
        container,
        fieldId: 'webhookUrl',
        type: InputTypes.TEXTFIELD,
        value: 'testUrl'
      }
    ])

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('Test'))
    })

    expect(testNotification).toHaveBeenCalledWith({
      accountId: 'dummy',
      type: 'SLACK',
      recipient: 'testUrl',
      notificationId: 'asd'
    })

    clickSubmit(container)

    await waitFor(() =>
      expect(handleSuccess).toHaveBeenCalledWith({
        type: NotificationType.Slack,
        webhookUrl: 'testUrl',
        userGroups: []
      })
    )
  })

  test('PagerDuty', async () => {
    const handleSuccess = jest.fn()

    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/test" pathParams={{ accountId: 'dummy' }}>
        <ConfigurePagerDutyNotifications hideModal={noop} onSuccess={handleSuccess} />
      </TestWrapper>
    )

    fillAtForm([
      {
        container,
        fieldId: 'key',
        type: InputTypes.TEXTFIELD,
        value: 'testKey'
      }
    ])

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('Test'))
    })

    expect(testNotification).toHaveBeenCalledWith({
      accountId: 'dummy',
      type: 'PAGERDUTY',
      recipient: 'testKey',
      notificationId: 'asd'
    })

    clickSubmit(container)
    await waitFor(() =>
      expect(handleSuccess).toHaveBeenCalledWith({
        type: NotificationType.PagerDuty,
        key: 'testKey',
        userGroups: []
      })
    )
  })
})
