import React from 'react'
import { findByText, render } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { TestWrapper } from '@common/utils/testUtils'
import { useMutateAsGet } from '@common/hooks'
import { mockTemplates, mockTemplatesSuccessResponse } from '@templates-library/TemplatesTestHelper'
import { DeleteTemplateModal } from '../DeleteTemplateModal'

jest.mock('@common/hooks', () => ({
  ...(jest.requireActual('@common/hooks') as any),
  useMutateAsGet: jest.fn()
}))

describe('<DeleteTemplateModal /> tests', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    // @ts-ignore
    useMutateAsGet.mockReturnValue(mockTemplatesSuccessResponse)
  })
  test('snapshot test', async () => {
    const template = mockTemplates.data?.content?.[0] || {}
    const onSuccess = jest.fn()
    const onClose = jest.fn()
    const { container, getByRole } = render(
      <TestWrapper defaultAppStoreValues={{ isGitSyncEnabled: false }}>
        <DeleteTemplateModal template={template} onSuccess={onSuccess} onClose={onClose} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    const cancelBtn = await findByText(container, 'cancel')
    fireEvent.click(cancelBtn)
    expect(onClose).toBeCalled()

    const deleteBtn = await getByRole('button', { name: 'Delete Selected' })
    expect(deleteBtn).toBeDisabled()

    const selectAllCheckBox = await findByText(container, 'Select All')
    fireEvent.click(selectAllCheckBox)
    expect(deleteBtn).not.toBeDisabled()
  })
})