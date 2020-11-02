import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import type { ResponseBoolean } from 'services/cd-ng'
import CreateAWSConnector from '../CreateAWSConnector'

const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}

describe('Create AWS connector Wizard', () => {
  test('should render form', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateAWSConnector hideLightModal={noop} onConnectorCreated={noop} mock={mockResponse} />
      </MemoryRouter>
    )

    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })
    // match step 1
    expect(container).toMatchSnapshot()
  })
})
