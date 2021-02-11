import { act, fireEvent, queryByText, render } from '@testing-library/react'
import type { ConnectorInfoDTO } from 'services/cv'

export interface BackButtonTestProps {
  Element: React.ReactElement
  mock: ConnectorInfoDTO
  backButtonSelector: string
}

export const backButtonTest = ({ Element, mock, backButtonSelector }: BackButtonTestProps) => {
  test('should go back to the previous step and show saved data', async () => {
    const { container } = render(Element)
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    await act(async () => {
      fireEvent.click(container.querySelector(backButtonSelector)!)
    })
    expect(container.querySelector('input[name="name"]')?.getAttribute('value')).toEqual(mock.name)
    expect(container.querySelector('textarea[name="description"]')?.textContent).toEqual(mock.description)
    expect(queryByText(container, mock.identifier)).toBeDefined()
  })
}
