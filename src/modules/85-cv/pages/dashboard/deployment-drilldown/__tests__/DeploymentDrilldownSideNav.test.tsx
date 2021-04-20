import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { act } from 'react-test-renderer'
import { TestWrapper } from '@common/utils/testUtils'
import DeploymentDrilldownSideNav from '../DeploymentDrilldownSideNav'

jest.mock('moment', () => {
  const original = jest.requireActual('moment')
  original().__proto__.format = () => 'XX:YY'
  return original
})

describe('DeploymentDrilldownSideNav', () => {
  test('renders correctly and fires onSelect callback', async () => {
    const onSelect = jest.fn()
    const mockedItem = {
      name: 'jobName',
      environment: 'test',
      startedOn: 1604952833417,
      status: 'VERIFICATION_PASSED'
    }
    const { container } = render(
      <TestWrapper>
        <DeploymentDrilldownSideNav
          selectedInstance={mockedItem}
          postDeploymentInstances={[mockedItem]}
          onSelect={onSelect}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    await waitFor(() => container.querySelector('.item'))
    act(() => {
      fireEvent.click(container.querySelector('.item')!)
    })
    expect(onSelect).toHaveBeenCalled()
  })
})
