import React from 'react'
import { render } from '@testing-library/react'
import { NGTooltipEditorPortal } from '../TooltipEditor'

const getDefaultProps = (showTooltipEditor: boolean) => ({
  onEditorClose: jest.fn(),
  showTooltipEditor
})

describe('Tooltip editor tests', () => {
  const rootParent = document.createElement('div')
  beforeEach(() => {
    rootParent.id = 'ngTooltipEditorRootParent'
    document.body.appendChild(rootParent)
  })

  afterEach(() => {
    document.body.removeChild(rootParent)
  })

  test('if it renders in portal', async () => {
    const props = getDefaultProps(true)
    const { queryByText } = render(<NGTooltipEditorPortal {...props} />)
    expect(queryByText('No toolip IDs found in the present context.')).toBeTruthy()
  })

  test('if it renders null if flag is toggled', () => {
    const props = getDefaultProps(false)
    const { container } = render(<NGTooltipEditorPortal {...props} />)
    expect(container).toMatchInlineSnapshot('<div />')
  })
})
