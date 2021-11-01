import React from 'react'
import { render } from '@testing-library/react'
import { mockTemplates } from '@templates-library/TemplatesTestHelper'
import { TemplatesListView } from '@templates-library/pages/TemplatesPage/views/TemplatesListView/TemplatesListView'
import { TestWrapper } from '@common/utils/testUtils'

describe('<TemplatesListView /> tests', () => {
  test('snapshot test', async () => {
    const { container } = render(
      <TestWrapper defaultAppStoreValues={{ isGitSyncEnabled: false }}>
        <TemplatesListView data={mockTemplates.data} gotoPage={jest.fn()} onSelect={jest.fn()} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
