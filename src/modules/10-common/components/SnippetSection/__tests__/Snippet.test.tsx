import React from 'react'
import { render, getByText, fireEvent, waitFor } from '@testing-library/react'
import { TestWrapper, findPopoverContainer } from '@common/utils/testUtils'
import Snippet from '../Snippet'

const props = {
  key: 'sample',
  onSnippetCopy: jest.fn(),
  name: 'Sample snippet',
  version: '1.0',
  description: 'Sample snippet for testing'
}

describe('Snippet Test', () => {
  test('Initial render should match snapshots', () => {
    const { container } = render(
      <TestWrapper>
        <Snippet {...props} />
      </TestWrapper>
    )
    expect(getByText(container, 'Sample snippet')).toBeDefined()
    waitFor(() => {
      fireEvent.click(container?.querySelector("[class='copy']")!)
      const popover = findPopoverContainer()
      const fetching = getByText(popover as HTMLElement, 'Fetching')
      expect(fetching).toBeDefined()
    })
    expect(container).toMatchSnapshot()
  })
})
