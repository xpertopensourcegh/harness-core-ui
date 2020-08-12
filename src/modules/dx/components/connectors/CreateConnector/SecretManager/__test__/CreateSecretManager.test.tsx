import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import CreateSecretManager from '../CreateSecretManager'

describe('Create Secret Manager Wizard', () => {
  test('should render form', () => {
    const dom = render(<CreateSecretManager accountId="dummy" hideLightModal={noop} />)

    // match step 1
    expect(dom.container).toMatchSnapshot()

    // fill step 1
    act(() => {
      fireEvent.change(dom.container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
      fireEvent.click(dom.container.querySelector('button[type="submit"]')!)
      // await waitFor(() => dom.getByText('Encryption Type'))
    })

    // match step 2
    expect(dom.container).toMatchSnapshot()
  })
})
