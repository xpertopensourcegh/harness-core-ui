import React from 'react'
import { render } from '@testing-library/react'
import { TemplatesGridView } from '@templates-library/pages/TemplatesPage/views/TemplatesGridView/TemplatesGridView'
import { mockTemplates } from '@templates-library/TemplatesTestHelper'
import { TestWrapper } from '@common/utils/testUtils'

describe('<TemplatesGridView /> tests', () => {
  test('snapshot test', async () => {
    const { container } = render(
      <TestWrapper defaultAppStoreValues={{ isGitSyncEnabled: false }}>
        <TemplatesGridView data={mockTemplates.data} gotoPage={jest.fn()} onSelect={jest.fn()} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
