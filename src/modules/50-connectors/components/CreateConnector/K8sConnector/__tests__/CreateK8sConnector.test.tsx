import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CreateK8sConnector, { IntermediateStep } from '../CreateK8sConnector'

const commonMockData = {
  accountId: 'dummyAccount',
  orgIdentifier: '',
  projectIdentifier: ''
}

const stateMockProps = {
  authentication: { label: 'Username and Password', value: 'UsernamePassword' },
  delegateList: {},
  delegateType: 'ManualConfig',
  formData: {
    name: 'testConnector',
    description: '',
    identifier: 'testConnector',
    tags: [],
    delegateType: 'ManualConfig'
  },
  inclusterDelegate: 'useExistingDelegate',
  installDelegate: false,
  isEditMode: false,
  setAuthentication: jest.fn(),
  setDelegateList: jest.fn(),
  setDelegateType: jest.fn(),
  setFormData: jest.fn(),
  setInClusterDelegate: jest.fn(),
  setInstallDelegate: jest.fn(),
  setIsEditMode: jest.fn()
}

describe('CreateK8s Connector', () => {
  test('render 1st step', async () => {
    const { container } = render(
      <TestWrapper {...commonMockData}>
        <CreateK8sConnector hideLightModal={jest.fn()} onSuccess={jest.fn()} {...commonMockData} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('render IntermediateStep', async () => {
    const { container, getByText } = render(
      <TestWrapper {...commonMockData}>
        <IntermediateStep
          name={'CREDENTIALS'}
          formData={{}}
          state={stateMockProps}
          previousStep={jest.fn()}
          nextStep={jest.fn()}
          onSuccess={jest.fn()}
          {...commonMockData}
        />
      </TestWrapper>
    )

    await waitFor(() => getByText('VALUE WILL BE SAVED TO SECRET MANAGER'))
    expect(container).toMatchSnapshot()
  })
})
