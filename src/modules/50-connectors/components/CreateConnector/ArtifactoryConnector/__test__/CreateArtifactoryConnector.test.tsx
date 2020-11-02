import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
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

describe('Create Artifactory connector Wizard', () => {
  test('should render form', async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <CreateArtifactoryConnector hideLightModal={noop} onConnectorCreated={noop} mock={mockResponse} />
      </MemoryRouter>
    )

    // match step 1
    expect(container).toMatchSnapshot()

    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    // match step 2
    expect(container).toMatchSnapshot()
    expect(queryByText(container, 'VALUE WILL BE SAVED TO SECRET MANAGER')).toBeDefined()
    // trying to create coonector with step 2 data
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    expect(queryByText(container, 'Artifactory URL is required')).toBeDefined()
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="artifactoryServerUrl"]')!, {
        target: { value: 'dummy artifactoryServerUrl' }
      })
    })
    expect(container).toMatchSnapshot()
    const backBtn = getByText('BACK')
    fireEvent.click(backBtn)
    // Coonector name should be retained
    expect(queryByText(container, 'dummy_name')).toBeDefined()
  })
})
