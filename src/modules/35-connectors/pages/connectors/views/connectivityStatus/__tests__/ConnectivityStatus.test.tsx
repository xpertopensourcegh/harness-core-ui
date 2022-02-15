import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ConnectivityStatus from '../ConnectivityStatus'
import mock from './mock.json'
const { failure, success, unknownType } = mock
jest.mock('services/cd-ng', () => ({
  useGetTestConnectionResult: jest.fn().mockImplementation(() => {
    return {
      cancel: jest.fn(),
      loading: false,
      mutate: jest.fn().mockImplementation(() => {
        return {
          data: {
            status: 'SUCCESS'
          }
        }
      })
    }
  })
}))
describe('connectivity status', () => {
  const setup = (data: any) =>
    render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectivityStatus data={data} />
      </TestWrapper>
    )

  test('fail render should match snapshot', async () => {
    const { container, getByText } = setup(failure)
    expect(container).toMatchSnapshot()
    const testBtn = getByText('test')

    act(() => {
      fireEvent.click(testBtn)
    })
    expect(container).toMatchSnapshot()
  })
  test('success render should match snapshot', async () => {
    const { container } = setup(success)

    expect(container).toMatchSnapshot()
  })
  test('unknown render should match snapshot', async () => {
    const { container } = setup(unknownType)

    expect(container).toMatchSnapshot()
  })
})
