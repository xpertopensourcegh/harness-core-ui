import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import type { ResponseBoolean } from 'services/cd-ng'
import CreateArtifactoryConnector from '../CreateArtifactoryConnector'

const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}

describe('Create Nexus connector Wizard', () => {
  test('should render form', async () => {
    const dom = render(
      <MemoryRouter>
        <CreateArtifactoryConnector hideLightModal={noop} onConnectorCreated={noop} mock={mockResponse} />
      </MemoryRouter>
    )

    // match step 1
    expect(dom.container).toMatchSnapshot()

    // fill step 1
    await act(async () => {
      fireEvent.change(dom.container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })

    await act(async () => {
      fireEvent.click(dom.container.querySelector('button[type="submit"]')!)
    })

    // match step 2
    expect(dom.container).toMatchSnapshot()
  })
})
