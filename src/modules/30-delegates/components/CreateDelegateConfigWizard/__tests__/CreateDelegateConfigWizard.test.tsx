import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { CreateDelegateConfigWizard } from '../CreateDelegateConfigWizard'

jest.mock('@common/components/YAMLBuilder/YamlBuilder')
jest.mock('@common/exports', () => ({
  useToaster: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn()
  })
}))
const voidFn = jest.fn()

describe('Create Delegate Wizard', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <CreateDelegateConfigWizard onClose={voidFn} onSuccess={voidFn} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
