import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import { TemplateContextMetadata, useSaveTemplate } from '@pipeline/utils/useSaveTemplate'
import type { NGTemplateInfoConfig } from 'services/template-ng'
import { createTemplatePromise, updateExistingTemplateLabelPromise } from 'services/template-ng'

export const stepTemplateMock = {
  name: 'Test Http Template',
  identifier: 'Test_Http_Template',
  versionLabel: 'v1',
  type: 'Step',
  projectIdentifier: 'Yogesh_Test',
  orgIdentifier: 'default',
  tags: {},
  spec: {
    type: 'Http',
    timeout: '1m 40s',
    spec: { url: '<+input>', method: 'GET', headers: [], outputVariables: [], requestBody: '<+input>' }
  }
}

jest.mock('services/template-ng', () => ({
  createTemplatePromise: jest.fn().mockImplementation(() => Promise.resolve({ status: 'SUCCESS' })),
  updateExistingTemplateLabelPromise: jest.fn().mockImplementation(() => Promise.resolve({ status: 'SUCCESS' }))
}))

const Wrapped = (props: TemplateContextMetadata): React.ReactElement => {
  const { saveAndPublish } = useSaveTemplate(props)
  return (
    <>
      <button onClick={() => saveAndPublish(stepTemplateMock as NGTemplateInfoConfig, {})}>Save</button>
      <button onClick={() => saveAndPublish(stepTemplateMock as NGTemplateInfoConfig, { isEdit: true })}>Edit</button>
    </>
  )
}

describe('useSaveTemplate Test', () => {
  test('create should work as expected', async () => {
    const props: TemplateContextMetadata = {
      template: stepTemplateMock as NGTemplateInfoConfig,
      deleteTemplateCache: jest.fn()
    }
    const { getByText } = render(
      <TestWrapper>
        <Wrapped {...props} />
      </TestWrapper>
    )

    const saveBtn = getByText('Save')
    await act(async () => {
      fireEvent.click(saveBtn)
    })
    const commentsDialog = findDialogContainer()
    expect(commentsDialog).toBeDefined()
    const textarea = commentsDialog!.querySelector('textarea[name="comments"]')!
    await act(async () => {
      fireEvent.change(textarea, {
        target: { value: 'some random comment' }
      })
    })
    const submitBtn = commentsDialog!.querySelector('button[type="submit"]')!
    await act(async () => {
      fireEvent.click(submitBtn)
    })
    expect(createTemplatePromise).toBeCalled()
    expect(props.deleteTemplateCache).toBeCalled()
  })
  test('edit should work as expected', async () => {
    const props: TemplateContextMetadata = {
      template: stepTemplateMock as NGTemplateInfoConfig,
      fetchTemplate: jest.fn()
    }
    const { getByText } = render(
      <TestWrapper>
        <Wrapped {...props} />
      </TestWrapper>
    )

    const saveBtn = getByText('Edit')
    await act(async () => {
      fireEvent.click(saveBtn)
    })
    const commentsDialog = findDialogContainer()
    const submitBtn = commentsDialog!.querySelector('button[type="submit"]')!
    await act(async () => {
      fireEvent.click(submitBtn)
    })
    expect(updateExistingTemplateLabelPromise).toBeCalled()
    expect(props.fetchTemplate).toBeCalled()
  })
})
