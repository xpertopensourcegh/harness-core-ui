import React from 'react'
import { render, findByText, fireEvent } from '@testing-library/react'
// import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import ManifestSelection from '../ManifestSelection'
describe('ManifestSelection tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <ManifestSelection isForOverrideSets={false} isForPredefinedSets={false} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test(`renders add Manifest option without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <ManifestSelection isForOverrideSets={false} isForPredefinedSets={false} />
      </TestWrapper>
    )
    const addFileButton = await findByText(container, '+ Add Manifest')
    expect(addFileButton).toBeDefined()
    fireEvent.click(addFileButton)
    const createFileModal = findByText(document.body, 'Specify your manifest file repository type')
    expect(createFileModal).toBeDefined()
    const closeButton = document.querySelector("button[class*='bp3-dialog-close-button']") as Element
    fireEvent.click(closeButton)
  })
})
