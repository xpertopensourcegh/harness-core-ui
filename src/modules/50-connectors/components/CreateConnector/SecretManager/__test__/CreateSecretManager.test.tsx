import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import CreateSecretManager from '../CreateSecretManager'

describe('Create Secret Manager Wizard', () => {
  test('should render form', async () => {
    const dom = render(
      <MemoryRouter>
        <CreateSecretManager hideLightModal={noop} onSuccess={noop} mock={true} />
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
