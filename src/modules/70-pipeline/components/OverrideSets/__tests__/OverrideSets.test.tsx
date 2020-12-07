import React from 'react'
import { render, findByText, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import OverrideSets from '../OverrideSets'
describe('OverrideSet tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(<OverrideSets selectedTab="Artifacts" />)
    expect(container).toMatchSnapshot()
  })
  test(`renders creation modal without crashing`, async () => {
    const { container } = render(<OverrideSets selectedTab="Artifacts" />)
    const creationButton = await findByText(container, '+ Create new override set')
    fireEvent.click(creationButton)
    const creationModalInputTitle = await findByText(document.body, 'Override Set Name')
    expect(creationModalInputTitle).toBeDefined()
  })
  test(`created override set without crashing`, async () => {
    const { container } = render(<OverrideSets selectedTab="Artifacts" />)
    const creationButton = await findByText(container, '+ Create new override set')
    fireEvent.click(creationButton)
    const creationModalInputTitle = await findByText(document.body, 'Override Set Name')
    expect(creationModalInputTitle).toBeDefined()
    const overrideSetNameInput = document.querySelector('input[class*="bp3-input"]')
    expect(overrideSetNameInput).toBeDefined()
    await act(async () => {
      fireEvent.change(overrideSetNameInput!, {
        target: { value: 'Dummy Set Name' }
      })
      fireEvent.click(await findByText(document.body, 'Submit'))
    })
  })
})
