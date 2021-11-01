import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { mockTemplates } from '@templates-library/TemplatesTestHelper'
import { TemplateListCardContextMenu } from '../TemplateListCardContextMenu'

describe('<TemplateListContextMenu /> tests', () => {
  test('snapshot test', async () => {
    const { container } = render(
      <TestWrapper>
        <TemplateListCardContextMenu template={mockTemplates.data?.content?.[0] || {}} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
