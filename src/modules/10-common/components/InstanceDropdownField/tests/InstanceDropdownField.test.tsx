import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { InstanceDropdownField, InstanceTypes } from '../InstanceDropdownField'

const props = {
  label: 'Instance',
  name: 'instances',

  value: { instance: 0, type: InstanceTypes.Instances },
  onChange: jest.fn()
}

describe('Unit tests for InstanceDropdownField Component', () => {
  test('render the component', () => {
    const { container } = render(
      <TestWrapper>
        <InstanceDropdownField {...props} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
