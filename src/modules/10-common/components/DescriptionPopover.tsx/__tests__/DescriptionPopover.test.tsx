import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DescriptionPopover from '../DescriptionPopover'

describe('Description popover test', () => {
  test('snapshot testing', () => {
    const { container } = render(
      <TestWrapper>
        <DescriptionPopover text="Test" />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
