import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'

import CreateSSHCredWizard from '../CreateSSHCredWizard'

import mockListSecrets from './mockListSecrets.json'

describe('Create Secret Manager Wizard', () => {
  test('should render form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <CreateSSHCredWizard hideModal={noop} onSuccess={noop} mockSecretReference={mockListSecrets as any} />
      </TestWrapper>
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
