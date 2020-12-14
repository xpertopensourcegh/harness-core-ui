import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TestWrapper } from '@common/utils/testUtils'
import SelectServices from '../SelectServices'
import mockServiceCD from './mockServices-CD1.json'
import mockServices from './mockServices.json'

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useRouteParams: () => ({
    params: {
      accountId: 'testAcc'
    },
    query: {
      orgId: 'testOrg'
    }
  })
}))

jest.mock('services/cd-ng', () => ({
  useGetServiceListForProject: () => mockServices,
  useCreateService: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

jest.mock('services/portal', () => ({
  useGetListServices: () => {
    return { data: mockServiceCD, refetch: jest.fn() }
  }
}))

describe('Select Services', () => {
  test('render services for application', async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <TestWrapper>
          <SelectServices initialValues={{ applications: { appId: { name: 'appName' } } }} onPrevious={jest.fn()} />
        </TestWrapper>
      </MemoryRouter>
    )
    expect(getByText('HARNESS CV 2.0 SERVICES')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
