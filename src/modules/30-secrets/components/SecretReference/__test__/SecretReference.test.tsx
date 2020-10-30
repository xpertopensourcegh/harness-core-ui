import React from 'react'
import { render, waitFor, getByText } from '@testing-library/react'

import { noop } from 'lodash-es'
import SecretReference from '../SecretReference'

import mockData from './listSecretsMock.json'

describe('Secret Reference', () => {
  test('render', async () => {
    const { container } = render(<SecretReference accountIdentifier="dummy" mock={mockData as any} onSelect={noop} />)

    await waitFor(() => getByText(container, 'text1'))
    expect(container).toMatchSnapshot()
  })
})
