import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { NavItem } from '../NavItem'

describe('Unit tests for NavItem', () => {
  test('Ensure item renders with correct content', async () => {
    const mockOnClick = jest.fn()
    const { container, getByText } = render(
      <NavItem label="Namespace1" leftLogo={{ name: 'service-kubernetes', size: 20 }} onClick={mockOnClick} />
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(getByText('Namespace1')).not.toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()

    const mainContainer = container.querySelector('[class*="main"]')
    if (!mainContainer) {
      throw Error('No container rendered.')
    }
    fireEvent.click(mainContainer)
    await waitFor(() => expect(mockOnClick).toHaveBeenCalledTimes(1))
    expect(mockOnClick).toHaveBeenCalledWith('Namespace1')
  })

  test('Ensure correct status icon is rendered when asked', async () => {
    const { container, unmount } = render(
      <NavItem label="Namespace1" leftLogo={{ name: 'service-kubernetes', size: 20 }} status="ERROR" />
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(container.querySelector('[data-name="ERROR"]')).not.toBeNull()

    unmount()

    const { container: container2, unmount: unmount2 } = render(
      <NavItem label="Namespace1" leftLogo={{ name: 'service-kubernetes', size: 20 }} status="WARNING" />
    )
    await waitFor(() => expect(container2.querySelector('[class*="main"]')).not.toBeNull())
    expect(container2.querySelector('[data-name="WARNING"]')).not.toBeNull()
    unmount2()

    const { container: container3, unmount: unmount3 } = render(
      <NavItem label="Namespace1" leftLogo={{ name: 'service-kubernetes', size: 20 }} status="SUCCESS" />
    )
    await waitFor(() => expect(container3.querySelector('[class*="main"]')).not.toBeNull())
    expect(container3.querySelector('[data-name="SUCCESS"]')).not.toBeNull()
    unmount3()
  })
})
