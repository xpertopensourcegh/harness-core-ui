import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import ExecutionLayout from '../ExecutionLayout'
import { useExecutionLayoutContext, ExecutionLayoutState } from '../ExecutionLayoutContext'

describe('<ExecutionLayout /> tests', () => {
  test('Does not render third child by default', () => {
    const { container, getByTestId } = render(
      <ExecutionLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    expect(getByTestId('child-1').innerHTML).toBe('Child 1')
    expect(getByTestId('child-2').innerHTML).toBe('Child 2')
    expect(() => getByTestId('child-3')).toThrow()
    expect(container).toMatchSnapshot()
  })

  test('Showing third child works', () => {
    function Child2(): React.ReactElement {
      const { setLayout } = useExecutionLayoutContext()

      return (
        <button data-testid="layout" onClick={() => setLayout(ExecutionLayoutState.RIGHT)}>
          Show Child 3
        </button>
      )
    }
    const { container, getByTestId } = render(
      <ExecutionLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">
          <Child2 />
        </div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    fireEvent.click(getByTestId('layout'))
    expect(getByTestId('child-1').innerHTML).toBe('Child 1')
    expect(getByTestId('child-3').innerHTML).toBe('Child 3')
    expect(container).toMatchSnapshot()
  })

  test('"RIGHT" Layout works', () => {
    const { container, getByTestId } = render(
      <ExecutionLayout defaultLayout={ExecutionLayoutState.RIGHT}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    expect(getByTestId('child-1').innerHTML).toBe('Child 1')
    expect(getByTestId('child-2').innerHTML).toBe('Child 2')
    expect(getByTestId('child-3').innerHTML).toBe('Child 3')
    expect(container.querySelector('.splitPane2')?.classList.contains('vertical')).toBe(true)
    expect(container).toMatchSnapshot()
  })

  test('"BOTTOM" Layout works', () => {
    const { container, getByTestId } = render(
      <ExecutionLayout defaultLayout={ExecutionLayoutState.BOTTOM}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    expect(getByTestId('child-1').innerHTML).toBe('Child 1')
    expect(getByTestId('child-2').innerHTML).toBe('Child 2')
    expect(getByTestId('child-3').innerHTML).toBe('Child 3')
    expect(container.querySelector('.splitPane2')?.classList.contains('horizontal')).toBe(true)
    expect(container).toMatchSnapshot()
  })

  test('"FLOATING" Layout works', () => {
    const { container, getByTestId } = render(
      <ExecutionLayout defaultLayout={ExecutionLayoutState.FLOATING}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    expect(getByTestId('child-1').innerHTML).toBe('Child 1')
    expect(getByTestId('child-2').innerHTML).toBe('Child 2')
    expect(getByTestId('child-3').innerHTML).toBe('Child 3')
    expect(getByTestId('child-3').parentElement?.classList.contains('floating-wrapper')).toBe(true)
    expect(container).toMatchSnapshot()
  })

  test('"FLOATING" Layout - toggle window works', () => {
    const { container, getByTestId } = render(
      <ExecutionLayout defaultLayout={ExecutionLayoutState.FLOATING}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    expect(getByTestId('child-3').innerHTML).toBe('Child 3')
    expect(container).toMatchSnapshot('Child 3 is shown')

    const btn = container.querySelector('.stepDetails button')!
    fireEvent.click(btn)

    expect(() => getByTestId('child-3')).toThrow()
    expect(container).toMatchSnapshot('Child 3 is not shown')
  })

  test('Resizing via resize button works', () => {
    const { container } = render(
      <ExecutionLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    const [resizeUp, resizeDown] = container.querySelectorAll('.bp3-button')

    fireEvent.click(resizeDown)
    expect(container.querySelector<HTMLDivElement>('.splitPane1 .Pane1')?.style.height).toBe('300px')

    fireEvent.click(resizeUp)
    expect(container.querySelector<HTMLDivElement>('.splitPane1 .Pane1')?.style.height).toBe('200px')
  })

  test('ExecutionLayout.Toggle works', () => {
    const { container, getByTestId } = render(
      <ExecutionLayout defaultLayout={ExecutionLayoutState.RIGHT}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">
          <ExecutionLayout.Toggle />
        </div>
        <div data-testid="child-3">Child 3</div>
      </ExecutionLayout>
    )

    expect(container).toMatchSnapshot()

    const [right, bottom, floating] = container.querySelectorAll<HTMLInputElement>('input[name="layout"]')

    expect(right.checked).toBe(true)
    expect(container.querySelector('.splitPane2')?.classList.contains('vertical')).toBe(true)

    fireEvent.click(bottom)
    expect(container.querySelector('.splitPane2')?.classList.contains('horizontal')).toBe(true)

    fireEvent.click(floating)
    expect(getByTestId('child-3').parentElement?.classList.contains('floating-wrapper')).toBe(true)
  })
})
