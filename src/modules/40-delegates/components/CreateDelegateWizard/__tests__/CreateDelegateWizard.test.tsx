import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { Delegates } from '@delegates/constants'
import { CreateDelegateWizard } from '../CreateDelegateWizard'
jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', () => {
  const ComponentToMock = () => <div>yamlDiv</div>
  return ComponentToMock
})
describe('Create Delegate Wizard', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <CreateDelegateWizard type={Delegates.KUBERNETES_CLUSTER} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
