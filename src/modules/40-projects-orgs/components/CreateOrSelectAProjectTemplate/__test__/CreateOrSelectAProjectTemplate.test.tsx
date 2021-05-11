import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { CreateOrSelectAProjectTemplate } from '../CreateOrSelectAProjectTemplate'

const props = {
  moduleDescription: 'CD Create or select a project',
  onSelectProject: jest.fn(),
  onCreateProject: jest.fn()
}
describe('Rendering', () => {
  test('should render', () => {
    const { container } = render(
      <TestWrapper>
        <CreateOrSelectAProjectTemplate {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
