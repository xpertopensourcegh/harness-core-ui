import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router'

import CreateSSHCredWizard from '../CreateSSHCredWizard'

import mockListSecrets from './mockListSecrets.json'

describe('Create Secret Manager Wizard', () => {
  test('should render form', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateSSHCredWizard hideModal={noop} onSuccess={noop} mockSecretReference={mockListSecrets as any} />
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

    // submit step 1
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    // match step 2
    expect(container).toMatchSnapshot()
  })
})
