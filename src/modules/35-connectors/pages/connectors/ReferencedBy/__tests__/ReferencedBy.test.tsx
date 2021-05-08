import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ReferencedBy from '../ReferencedBy'
import referencedData from './referenced-entities-data.json'

describe('Referenced By', () => {
  test('render for no data', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/resources/connectors/:connectorId"
        pathParams={{ accountId: 'dummy', connectorId: 'connectorId' }}
      >
        <ReferencedBy
          accountId="accountId"
          entityIdentifier="entityIdentifier"
          entityType="Connectors"
          mockData={{
            data: {} as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'There are no references of this Connector.'))
    expect(container).toMatchSnapshot()
  })
  test('render for data', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId/resources/connectors/:connectorId"
        pathParams={{ accountId: 'dummy', connectorId: 'connectorId' }}
      >
        <ReferencedBy
          accountId="accountId"
          entityIdentifier="entityIdentifier"
          entityType="Connectors"
          mockData={{
            data: referencedData as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    expect(getByText('ENTITY')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
