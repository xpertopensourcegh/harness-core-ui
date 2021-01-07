import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DelegatesPage from '../DelegatesPage'

const mockGetCallFunction = jest.fn()
jest.mock('services/portal', () => ({
  getDelegates: jest.fn().mockImplementation(args => {
    mockGetCallFunction(args)
    return []
  })
}))

jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', () => {
  const ComponentToMock = () => <div>yamlDiv</div>
  return ComponentToMock
})
describe('Delegates Page', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/delegates" pathParams={{ accountId: 'dummy' }}>
        <DelegatesPage />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
