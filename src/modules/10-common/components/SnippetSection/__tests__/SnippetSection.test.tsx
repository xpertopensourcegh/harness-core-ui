import React from 'react'
import { render } from '@testing-library/react'
import SnippetSection from '../SnippetSection'

describe('SnippetSection Test', () => {
  test('Initial render should match snapshots', () => {
    const { container } = render(<SnippetSection entityType={'Connectors'} showIconMenu={true} />)
    expect(container).toMatchSnapshot()
  })
})
