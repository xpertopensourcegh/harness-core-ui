import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReferencedBy from '../ReferencedBy'
import referencedData from './referenced-entities-data.json'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Referenced By', () => {
  test('render for no data', async () => {
    const { container } = render(
      <MemoryRouter>
        <ReferencedBy
          accountId="accountId"
          entityIdentifier="entityIdentifier"
          mockData={{
            data: {} as any,
            loading: false
          }}
        />
      </MemoryRouter>
    )
    await waitFor(() => queryByText(container, 'There are no references of this Connector.'))
    expect(container).toMatchSnapshot()
  })
  test('render for data', async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <ReferencedBy
          accountId="accountId"
          entityIdentifier="entityIdentifier"
          mockData={{
            data: referencedData as any,
            loading: false
          }}
        />
      </MemoryRouter>
    )
    expect(getByText('ENTITY')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
