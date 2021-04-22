import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import Configuration from '@common/pages/AuthenticationSettings/Configuration/Configuration'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { mockResponse } from '@common/pages/AuthenticationSettings/__test__/mock'

jest.mock('services/cd-ng', () => ({
  useGetAuthenticationSettings: jest.fn().mockImplementation(() => {
    return { mutate: () => Promise.resolve(mockResponse) }
  })
}))

describe('Configuration', () => {
  test('Configuration page', () => {
    const { container } = render(
      <TestWrapper
        path={routes.toAuthenticationSettings({ ...accountPathProps })}
        pathParams={{ accountId: 'testAcc' }}
      >
        <Configuration />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
