import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import ResponsivePagination, { DEFAULT_BREAK_POINT, ResponsivePaginationProps } from '../ResponsivePagination'

const { getComputedStyle } = window
window.getComputedStyle = elt => getComputedStyle(elt)

const renderComponent = (props: Partial<ResponsivePaginationProps> = {}): RenderResult =>
  render(
    <ResponsivePagination pageIndex={0} pageSize={10} pageCount={30} itemCount={300} gotoPage={jest.fn} {...props} />
  )

const setWindowWidth = (width: number): void => {
  Object.defineProperty(window, 'outerWidth', {
    writable: true,
    configurable: true,
    value: width
  })

  window.dispatchEvent(new Event('resize'))
}

describe('ResponsivePagination', () => {
  test('it should display the buttons when the browser width is above the default break point', async () => {
    setWindowWidth(DEFAULT_BREAK_POINT + 200)
    renderComponent()

    await waitFor(() => expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument())
  })

  test('it should display the buttons when the browser width is at the default break point', async () => {
    setWindowWidth(DEFAULT_BREAK_POINT)
    renderComponent()

    await waitFor(() => expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument())
  })

  test('it should not display the buttons when the browser width is below the default break point', async () => {
    setWindowWidth(DEFAULT_BREAK_POINT - 200)
    renderComponent()

    await waitFor(() => expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument())
  })

  test('it should display the buttons when the browser width is above the passed break point', async () => {
    setWindowWidth(1300)
    renderComponent({ breakAt: 1024 })

    await waitFor(() => expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument())
  })

  test('it should display the buttons when the browser width is at the passed break point', async () => {
    const breakPoint = 1024
    setWindowWidth(breakPoint)
    renderComponent({ breakAt: breakPoint })

    await waitFor(() => expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument())
  })

  test('it should not display the buttons when the browser width is below the passed break point', async () => {
    setWindowWidth(960)
    renderComponent({ breakAt: 1024 })

    await waitFor(() => expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument())
  })

  test('it should show/hide the buttons as the window resizes', async () => {
    setWindowWidth(DEFAULT_BREAK_POINT + 200)
    renderComponent()

    await waitFor(() => expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument())

    setWindowWidth(DEFAULT_BREAK_POINT - 200)
    await waitFor(() => expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument())

    setWindowWidth(DEFAULT_BREAK_POINT)
    await waitFor(() => expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument())
  })
})
