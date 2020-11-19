import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'

import type { ResponseBoolean } from 'services/cd-ng'
import CreateK8sConnector from '../CreateK8sConnector'

const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}

describe('Create k8 connector Wizard', () => {
  test('should form for authtype username', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateK8sConnector hideLightModal={noop} onConnectorCreated={noop} mock={mockResponse} />
      </TestWrapper>
    )
    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy k8' }
      })
    })
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'Manually enter master url and credentials')).toBeDefined()
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="username"]')!, {
        target: { value: 'dummy username' }
      })
    })
    expect(container).toMatchSnapshot()
  })
})
