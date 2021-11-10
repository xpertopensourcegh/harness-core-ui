import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import Step1Setup from '../Step1Setup/Step1Setup'

jest.mock('services/portal', () => ({
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
  })
}))

describe('Create Docker Step1Setup', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <Step1Setup />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
