import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import { TestWrapper } from '@common/utils/testUtils'
import CreateGCRConnector from '../CreateGCRConnector'

describe('Create Docker connector Wizard', () => {
  test('should render form', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <TestWrapper>
          <CreateGCRConnector hideLightModal={noop} handleSubmit={noop} />
        </TestWrapper>
      </MemoryRouter>
    )
    expect(getByText('Name')).toBeDefined()
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
