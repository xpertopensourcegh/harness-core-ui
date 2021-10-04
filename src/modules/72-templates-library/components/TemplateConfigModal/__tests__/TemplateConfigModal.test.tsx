import React from 'react'
import { render, act, fireEvent, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { ConfigModalProps, TemplateConfigModal } from '../TemplateConfigModal'

const getProps = (): ConfigModalProps => ({
  onClose: jest.fn(),
  initialValues: {
    name: '',
    type: 'Step',
    identifier: 'My_Step_Template',
    versionLabel: 'v1'
  },
  modalProps: {
    title: 'Some Title',
    promise: Promise.resolve
  }
})

describe('CREATE MODE', () => {
  test('VALIDATIONS', async () => {
    const props = getProps()
    const { getByText, queryByText } = render(
      <TestWrapper>
        <TemplateConfigModal {...props} />
      </TestWrapper>
    )
    act(() => {
      fireEvent.click(getByText('save'))
    })
    await waitFor(() => expect(queryByText('templatesLibrary.createNewModal.validation.name')).toBeTruthy())
  })

  test('if form changesupdate the preview card', async () => {
    const props = getProps()
    const { container, getByPlaceholderText } = render(
      <TestWrapper>
        <TemplateConfigModal {...props} />
      </TestWrapper>
    )
    act(() => {
      fireEvent.change(getByPlaceholderText('common.namePlaceholder'), { target: { value: 'templatename' } })
    })
    expect(container).toMatchSnapshot('changed value should be present in the preview')
  })

  test('if form closes', async () => {
    const props = getProps()
    const { container, getByText } = render(
      <TestWrapper>
        <TemplateConfigModal {...props} />
      </TestWrapper>
    )
    act(() => {
      fireEvent.click(getByText('cancel'))
    })
    await waitFor(() => expect(props.onClose).toBeCalled())

    const crossIcon = container.querySelector('span[icon="cross"]')
    act(() => {
      fireEvent.click(crossIcon!)
    })
    await waitFor(() => expect(props.onClose).toBeCalled())
  })
})
