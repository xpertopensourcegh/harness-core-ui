import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ConnectorDetailsPage from '../ConnectorDetailsPage'
import connector from './mocks/get-connector-mock.json'

jest.mock('react-timeago', () => () => 'dummy date')

jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', () => {
  const ComponentToMock = () => <div />
  return ComponentToMock
})

describe('Connector DetailsPage Page Test', () => {
  test('Initial snapshot should match render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/resources/connectors/:connectorId"
        pathParams={{ accountId: 'dummy', connectorId: 'connectorId' }}
      >
        <ConnectorDetailsPage mockData={connector}></ConnectorDetailsPage>
      </TestWrapper>
    )
    // const overviewLabel = getByText('Overview')
    // expect(overviewLabel).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
