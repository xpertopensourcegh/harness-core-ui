import React from 'react'

import { queryByAttribute, render, getByPlaceholderText, fireEvent, act, waitFor } from '@testing-library/react'
import PipelineCreate from '../CreateModal/PipelineCreate'
import i18n from '../CreateModal/PipelineCreate.i18n'

const props = {}

describe('PipelineCreate test', () => {
  test('initializes ok ', async () => {
    const { container } = render(<PipelineCreate {...props} />)
    expect(queryByAttribute('class', container, /container/)).not.toBeNull()
    const nameInput = getByPlaceholderText(container, i18n.pipelineName)
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
})
