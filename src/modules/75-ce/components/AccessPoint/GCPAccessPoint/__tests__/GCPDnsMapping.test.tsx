/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import GCPDnsMapping from '../GCPDnsMapping'
import { initialLoadBalancer, params } from './mocks'

describe('GCP DNS mapping screen', () => {
  test('render configuration dialog and fill details', async () => {
    const { container, getByTestId } = render(
      <TestWrapper pathParams={params}>
        <GCPDnsMapping
          loadBalancer={initialLoadBalancer}
          handleSubmit={jest.fn()}
          mode={'create'}
          handleCancel={jest.fn()}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement
    expect(nameInput).toBeDefined()
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'GCP AP' } })
    })
    expect(nameInput.value).toBe('GCP AP')

    const domainInput = container.querySelector('input[name="customDomain"]') as HTMLInputElement
    expect(domainInput).toBeDefined()
    act(() => {
      fireEvent.change(domainInput, { target: { value: 'custom.domain.test' } })
    })
    expect(domainInput.value).toBe('custom.domain.test')

    const saveBtn = getByTestId('saveGcpDetails')
    expect(saveBtn).toBeDefined()
    fireEvent.click(saveBtn)

    expect(container).toMatchSnapshot()
  })

  test('Name field should be disabled and should contain load balancer name in case of import/edit', () => {
    const { container } = render(
      <TestWrapper pathParams={params}>
        <GCPDnsMapping
          loadBalancer={{ ...initialLoadBalancer, name: 'Mock GCP Load Balancer' }}
          handleSubmit={jest.fn()}
          mode={'edit'}
          handleCancel={jest.fn()}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement
    expect(nameInput.value).toEqual('Mock GCP Load Balancer')
    expect(nameInput.attributes.getNamedItem('disabled')).toBeTruthy()
  })
})
