import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import CreateDockerConnector from '../CreateDockerConnector'

describe('Create Secret Manager Wizard', () => {
  test('should render form', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <CreateDockerConnector hideLightModal={noop} />
      </MemoryRouter>
    )
    expect(getByText('Give your Docker Connector a name')).toBeDefined()
    // match step 1
    expect(container).toMatchSnapshot()

    // fill step 1
    act(() => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    // match step 2
    expect(container).toMatchSnapshot()
  })
})
