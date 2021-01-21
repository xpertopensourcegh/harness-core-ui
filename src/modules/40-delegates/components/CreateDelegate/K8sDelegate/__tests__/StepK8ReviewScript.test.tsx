import React from 'react'
import { fireEvent, render, wait } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import Stepk8ReviewScript from '../StepReviewScript/Stepk8sReviewScript'

jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', () => {
  const ComponentToMock = () => <div>yamlDiv</div>
  return ComponentToMock
})

const props = {
  onBack: jest.fn()
}
describe('Create Step Review Script Delegate', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <Stepk8ReviewScript {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('Click continue button', async () => {
    const { container } = render(
      <TestWrapper>
        <Stepk8ReviewScript {...props} />
      </TestWrapper>
    )
    const stepReviewScriptContinueButton = container?.querySelector('#stepReviewScriptContinueButton')
    fireEvent.click(stepReviewScriptContinueButton!)
    await wait()
    expect(container).toMatchSnapshot()
  })
  test('Click back button', async () => {
    const { container } = render(
      <TestWrapper>
        <Stepk8ReviewScript {...props} />
      </TestWrapper>
    )
    const stepReviewScriptBackButton = container?.querySelector('#stepReviewScriptBackButton')
    fireEvent.click(stepReviewScriptBackButton!)
    await wait()
    expect(container).toMatchSnapshot()
  })
})
