import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { SetupSourceLayout } from '../SetupSourceLayout'

describe('Unit tests for SetupSourceLayout', () => {
  test('Ensure that layout properly displays content without left and right panel', async () => {
    const { container } = render(
      <TestWrapper>
        <SetupSourceLayout content={<Container className="mainContent" />} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('.mainContent')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="leftPanel"]')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="rightPanel"]')).not.toBeNull())
  })
  test('Ensure that layout properly displays content with left and right panel', async () => {
    const { container } = render(
      <TestWrapper>
        <SetupSourceLayout
          content={<Container className="mainContent" />}
          leftPanelContent={<Container className="left" />}
          rightPanelContent={<Container className="right" />}
        />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('.mainContent')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="leftPanel"]')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="rightPanel"]')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="left"]')).not.toBeNull())
    await waitFor(() => expect(container.querySelector('[class*="right"]')).not.toBeNull())
  })
})
