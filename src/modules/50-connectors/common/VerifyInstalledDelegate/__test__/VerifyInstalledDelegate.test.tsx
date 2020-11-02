import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import VerifyInstalledDelegate from '../VerifyInstalledDelegate'

const mockProp = {
  accountId: 'dummyAccount',
  connectorIdentifier: 'testConnector',
  connectorName: 'testConnector',
  currentStep: jest.fn(),
  delegateName: 'testDelegate',
  firstStep: jest.fn(),
  gotoStep: jest.fn(),
  hideLightModal: jest.fn(),
  lastStep: jest.fn(),
  name: 'VERIFY CONNECTION',
  nextStep: jest.fn(),
  onSuccess: jest.fn(),
  orgIdentifier: '',
  prevStepData: {},
  previousStep: jest.fn(),
  profile: 'testProfile',
  projectIdentifier: '',
  totalSteps: jest.fn()
}

describe('VerifyInstalledDelegate', () => {
  test('render VerifyInstalledDelegate', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <VerifyInstalledDelegate {...mockProp} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
