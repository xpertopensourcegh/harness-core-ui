import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { useTelemetry } from '../useTelemetry'

const identifyMock = jest.fn()
const trackMock = jest.fn()
const pageMock = jest.fn()
jest.mock('@common/hooks/useTelemetryInstance', () => {
  return {
    useTelemetryInstance: () => {
      return {
        identify: identifyMock,
        track: trackMock,
        page: pageMock
      }
    }
  }
})

describe('useTelemetry', () => {
  test('identifyUser', () => {
    const email = 'test@harness.io'
    const wrapper = ({ children }: React.PropsWithChildren<unknown>): React.ReactElement => (
      <TestWrapper path={routes.toProjects({ accountId: 'dummy' })} pathParams={{ accountId: 'dummy' }}>
        {children}
      </TestWrapper>
    )
    const { result } = renderHook(
      () =>
        useTelemetry({
          pageName: 'page'
        }),
      { wrapper }
    )
    result.current.identifyUser(email)
    result.current.trackEvent('event1', {})
    expect(identifyMock).toHaveBeenCalledWith(email)
    expect(trackMock).toHaveBeenCalledWith({ event: 'event1', properties: { groupId: undefined, userId: '' } })
    expect(pageMock).toHaveBeenCalledWith({
      name: 'page',
      category: '',
      properties: {
        userId: ''
      }
    })
  })
})
