import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { NotificationType } from '@notifications/interfaces/Notifications'
import useConfigureNotificationsModal from '../ConfigureNotificationsModal'

jest.mock('../views/ConfigureEmailNotifications/ConfigureEmailNotifications', () => () => (
  <div className="ConfigureEmailNotifications" />
))
jest.mock('../views/ConfigureSlackNotifications/ConfigureSlackNotifications', () => () => (
  <div className="ConfigureSlackNotifications" />
))
jest.mock('../views/ConfigurePagerDutyNotifications/ConfigurePagerDutyNotifications', () => () => (
  <div className="ConfigurePagerDutyNotifications" />
))

const TestComponent = (props: any) => {
  const { showModal } = useConfigureNotificationsModal({
    type: props.type,
    onSuccess: jest.fn()
  })
  return <button className="clickme" onClick={showModal} />
}

describe('ConfigureNotificationsModal', () => {
  test('renders ConfigureSlackNotifications correctly', () => {
    const { container } = render(
      <TestWrapper>
        <TestComponent type={NotificationType.Slack} />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.clickme')!)
    expect(container.querySelector('.ConfigureSlackNotifications')).toBeDefined()
  })

  test('renders ConfigureEmailNotifications correctly', () => {
    const { container } = render(
      <TestWrapper>
        <TestComponent type={NotificationType.Email} />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.clickme')!)
    expect(container.querySelector('.ConfigureEmailNotifications')).toBeDefined()
  })

  test('renders ConfigurePagerDutyNotifications correctly', () => {
    const { container } = render(
      <TestWrapper>
        <TestComponent type={NotificationType.PagerDuty} />
      </TestWrapper>
    )
    fireEvent.click(container.querySelector('.clickme')!)
    expect(container.querySelector('.ConfigurePagerDutyNotifications')).toBeDefined()
  })
})
