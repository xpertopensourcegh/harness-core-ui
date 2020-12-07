import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TestWrapper } from '@common/utils/testUtils'
import SelectEnvironment from '../SelectEnvironment'
import mockEnv from './mockEnv-CD1.json'

import mockEnvironments from './mockEnvironments.json'

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
  useGetEnvironmentListForProject: () => mockEnvironments,
  useCreateEnvironment: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

jest.mock('services/portal', () => ({
  useGetListEnvironments: () => {
    return { data: mockEnv, refetch: jest.fn() }
  }
}))

describe('SelectEnvironment', () => {
  test('render', async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <TestWrapper>
          <SelectEnvironment initialValues={{ applications: { appId: { name: 'appName' } } }} onPrevious={jest.fn()} />
        </TestWrapper>
      </MemoryRouter>
    )
    expect(getByText('ENVIRONMENTS')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
