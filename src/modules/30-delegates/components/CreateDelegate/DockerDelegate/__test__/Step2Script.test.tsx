import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@common/utils/testUtils'
import Step2Script from '../Step2Script/Step2Script'

jest.mock('services/portal', () => ({
  useGenerateDockerDelegateYAML: jest.fn().mockImplementation(() => {
    return {
      mutate: jest.fn().mockImplementation(() => '')
    }
  })
}))

describe('Create Docker Step2Script', () => {
  test('render component and go back', async () => {
    const { container, getByRole } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc', orgIdentifier: 'org1', projectIdentifier: 'proj1' }}>
        <Step2Script />
      </TestWrapper>
    )
    const backBtn = getByRole('button', { name: /back/ })

    userEvent.click(backBtn!)

    expect(container).toMatchSnapshot()
  })

  test('render component and go next', async () => {
    const { getByRole } = render(
      <TestWrapper pathParams={{ accountId: 'testAcc', orgIdentifier: 'org1', projectIdentifier: 'proj1' }}>
        <Step2Script />
      </TestWrapper>
    )
    const continueBtn = getByRole('button', { name: /continue/ })
    userEvent.click(continueBtn!)
    expect(continueBtn).toBeDisabled()
  })
})
