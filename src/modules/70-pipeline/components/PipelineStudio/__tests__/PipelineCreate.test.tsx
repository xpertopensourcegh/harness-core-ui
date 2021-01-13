import React from 'react'
import { queryByAttribute, render, getByPlaceholderText, fireEvent, act, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import PipelineCreate from '../CreateModal/PipelineCreate'
import i18n from '../CreateModal/PipelineCreate.i18n'
import type { PipelineCreateProps } from '../CreateModal/PipelineCreate'
import { DefaultNewPipelineId } from '../PipelineContext/PipelineActions'

const afterSave = jest.fn()
const closeModal = jest.fn()

const getEditProps = (identifier = 'test', description = 'desc', name = 'pipeline'): PipelineCreateProps => ({
  afterSave,
  initialValues: { identifier, description, name },
  closeModal
})

describe('PipelineCreate test', () => {
  test('initializes ok for CI module', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/dashboard"
        pathParams={{
          accountId: 'dummy'
        }}
      >
        <PipelineCreate />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    expect(queryByAttribute('class', container, /container/)).not.toBeNull()
    const nameInput = getByPlaceholderText(container, i18n.pipelineNamePlaceholder)
    expect(nameInput).not.toBeNull()
    const collpase = container.querySelector('[class*="collapseDiv"]')
    expect(collpase).not.toBeNull()
    const submit = container.getElementsByTagName('button')[0]
    await act(async () => {
      fireEvent.change(nameInput, 'Sample Pipeline')
      fireEvent.click(submit)
    })
    await waitFor(() => nameInput.getAttribute('value') == 'Sample Pipeline')
    if (collpase) {
      await act(async () => {
        fireEvent.click(collpase)
      })

      expect(container.querySelector('[class*="collapseDiv"]')).not.toBeNull()
    }
  })
  test('initializes ok for CD module', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/cd/dashboard"
        pathParams={{
          accountId: 'dummy'
        }}
      >
        <PipelineCreate />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    expect(queryByAttribute('class', container, /container/)).not.toBeNull()
    const nameInput = getByPlaceholderText(container, i18n.pipelineNamePlaceholder)
    expect(nameInput).not.toBeNull()
    const collpase = container.querySelector('[class*="collapseDiv"]')
    expect(collpase).not.toBeNull()
    const submit = container.getElementsByTagName('button')[0]
    await act(async () => {
      fireEvent.change(nameInput, 'Sample Pipeline')
      fireEvent.click(submit)
    })
    await waitFor(() => nameInput.getAttribute('value') == 'Sample Pipeline')
    if (collpase) {
      await act(async () => {
        fireEvent.click(collpase)
      })

      expect(container.querySelector('[class*="collapseDiv"]')).not.toBeNull()
    }
  })
  test('initializes ok edit pipeline', async () => {
    afterSave.mockReset()
    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId/ci/dashboard"
        pathParams={{
          accountId: 'dummy'
        }}
      >
        <PipelineCreate {...getEditProps()} />
      </TestWrapper>
    )
    await waitFor(() => getByText('Save'))
    expect(container).toMatchSnapshot()
    const saveBtn = getByText('Save')
    fireEvent.click(saveBtn)
    await waitFor(() => expect(afterSave).toBeCalledTimes(1))
    expect(afterSave).toBeCalledWith({
      description: 'desc',
      identifier: 'test',
      name: 'pipeline'
    })
    const closeBtn = container.querySelector('[icon="cross"]')
    fireEvent.click(closeBtn!)
    await waitFor(() => expect(closeModal).toBeCalledTimes(1))
    expect(closeModal).toBeCalled()
  })
  test('initializes ok new pipeline', async () => {
    closeModal.mockReset()
    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId/ci/dashboard"
        pathParams={{
          accountId: 'dummy'
        }}
      >
        <PipelineCreate {...getEditProps(DefaultNewPipelineId)} />
      </TestWrapper>
    )
    await waitFor(() => getByText('Start'))
    expect(container).toMatchSnapshot()
  })
})
