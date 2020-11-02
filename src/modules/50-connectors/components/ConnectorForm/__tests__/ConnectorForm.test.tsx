import React from 'react'
import { render } from '@testing-library/react'
import { Connectors } from '@connectors/constants'
import { TestWrapper } from '@common/utils/testUtils'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import ConnectorForm from '../ConnectorForm'

const commonMockData = {
  connector: {} as ConnectorInfoDTO,
  setConnector: jest.fn(),
  setConnectorForYaml: jest.fn(),
  onSubmit: jest.fn()
}

describe('ConnectorForm', () => {
  test('render GIT form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorForm type={Connectors.GIT} {...commonMockData} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('render DOCKER form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorForm type={Connectors.DOCKER} {...commonMockData} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('render VAULT form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorForm type={Connectors.VAULT} {...commonMockData} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
