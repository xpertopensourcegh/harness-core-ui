import { render, waitFor, queryByText } from '@testing-library/react'
import React from 'react'
import type { ConnectorResponse, Connector } from 'services/cd-ng'
import ConfigureConnector from '../ConfigureConnector'
import { GitHttp } from './mockData'

jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', jest.fn())

describe('Connector Details Page', () => {
  test('Rendring connector deatils', async () => {
    const { container } = render(
      <ConfigureConnector
        type={'Git'}
        response={GitHttp.data.content as ConnectorResponse}
        updateConnector={(data: Connector) => new Promise(resolve => resolve(data))}
        refetchConnector={() => new Promise(resolve => resolve())}
      ></ConfigureConnector>
    )
    await waitFor(() => queryByText(container, 'Connector Activity'))
    expect(container).toMatchSnapshot('view text')
  })
})
