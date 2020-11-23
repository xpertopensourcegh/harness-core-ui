import { render, waitFor, queryByText } from '@testing-library/react'
import React from 'react'
import type { ConnectorResponse, Connector } from 'services/cd-ng'
import { TestWrapper } from '@common/utils/testUtils'
import ConnectorView from '../ConnectorView'
import { GitHttp } from './mockData'

jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', jest.fn())

describe('Connector Details Page', () => {
  test('Rendring connector deatils', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorView
          type={'Git'}
          response={GitHttp.data.content as ConnectorResponse}
          updateConnector={(data: Connector) => new Promise(resolve => resolve(data))}
          refetchConnector={() => new Promise(resolve => resolve())}
        ></ConnectorView>
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Connector Activity'))
    expect(container).toMatchSnapshot('view text')
  })
})
