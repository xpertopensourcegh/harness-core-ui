import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CVNotificationTable from '../CVNotificationTable'
import mockList from './mockList.json'

jest.mock('react-timeago', () => () => 'dummy date')

describe('CVNotificationTable', () => {
  test('render notification table', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/cv/admin/notifications"
        pathParams={{ accountId: 'dummy', projectIdentifier: 'projectIdentifier', orgIdentifier: 'orgidentifier' }}
      >
        <CVNotificationTable data={mockList.resource as any} reload={jest.fn()} gotoPage={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Conditions'))

    expect(container).toMatchSnapshot()
  })
})
