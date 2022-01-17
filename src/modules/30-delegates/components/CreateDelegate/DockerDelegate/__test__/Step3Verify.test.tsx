import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import Step3Verify from '../Step3Verify/Step3Verify'

const createGroupFn = jest.fn().mockReturnValue({
  ok: true
})
jest.mock('services/portal', () => ({
  useCreateDelegateGroup: jest.fn().mockImplementation(() => {
    return {
      mutate: createGroupFn
    }
  }),
  useGetDelegatesHeartbeatDetailsV2: jest.fn().mockImplementation(() => {
    return { data: {}, refetch: jest.fn(), error: null, loading: false }
  })
}))

describe('Create Docker Step3Verify', () => {
  test('render data and go back', () => {
    const { container } = render(
      <TestWrapper>
        <Step3Verify />
      </TestWrapper>
    )

    const backBtn = container.querySelector('button') as HTMLButtonElement

    userEvent.click(backBtn!)

    expect(container).toMatchSnapshot()
  })
})
