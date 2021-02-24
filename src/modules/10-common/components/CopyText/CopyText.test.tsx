import React from 'react'
import { render } from '@testing-library/react'

import { CopyText } from './CopyText'

describe('<CopyText /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(<CopyText textToCopy="Hello world">Hello World</CopyText>)
    expect(container).toMatchSnapshot()
  })
})
