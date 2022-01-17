import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CreateDockerDelegate from '../CreateDockerDelegate'

const onBack = jest.fn()
jest.mock('services/portal', () => ({
  useCreateDelegateToken: jest.fn().mockImplementation(() => ({
    mutate: jest.fn().mockImplementation(() => undefined)
  })),
  useGetDelegateSizes: jest.fn().mockImplementation(() => {
    return {
      data: [
        {
          size: 'MEDIUM',
          label: 'medium',
          ram: '16',
          cpu: '4'
        }
      ],
      refetch: jest.fn(),
      error: null,
      loading: false
    }
  }),
  useGenerateDockerDelegate: jest.fn().mockImplementation(() => {
    return {
      mutate: jest.fn().mockImplementation(() => ({
        resource: {}
      }))
    }
  }),
  useGetDelegateTokens: jest.fn().mockImplementation(() => ({
    mutate: jest.fn().mockImplementation(() => ({
      resource: []
    }))
  }))
}))

describe('Create Docker Delegate', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <CreateDockerDelegate onBack={onBack} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
