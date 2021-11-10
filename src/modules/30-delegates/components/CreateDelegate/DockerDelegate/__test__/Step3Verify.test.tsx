import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import Step3Verify from '../Step3Verify/Step3Verify'

jest.mock('services/portal', () => ({
  useCreateDelegateGroup: jest.fn().mockImplementation(() => {
    return {
      mutate: jest.fn().mockImplementation(() => ({
        ok: true
      }))
    }
  }),
  useGetDelegatesHeartbeatDetailsV2: jest.fn().mockImplementation(() => {
    return { data: {}, refetch: jest.fn(), error: null, loading: false }
  })
}))

describe('Create Docker Step3Verify', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <Step3Verify />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
