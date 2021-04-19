import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { Collapse } from './Collapse'

describe('<Collapse /> tests', () => {
  test('toggle works', () => {
    const { container, getByTestId } = render(
      <Collapse title="Hello World!">
        <div data-testid="content">Lorem Ipsum</div>
      </Collapse>
    )

    expect(() => getByTestId('content')).toThrow()
    expect(container).toMatchSnapshot()

    const toggle = getByTestId('toggle-collapse')

    fireEvent.click(toggle)

    const content = getByTestId('content')

    expect(content).toBeTruthy()

    expect(container).toMatchSnapshot()
  })
})
