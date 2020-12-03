import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AppDApplicationSelector from '../AppDApplicationSelector'

const applicationsMock = {
  111: {
    id: 111,
    name: 'app1',
    environment: 'qa'
  },
  222: {
    id: 222,
    name: 'app2',
    environment: 'qa'
  },
  333: {
    id: 333,
    name: 'app3',
    environment: 'test'
  }
}

describe('AppDApplicationSelector', () => {
  test('matches snapshot', () => {
    const { container } = render(<AppDApplicationSelector applications={applicationsMock} statuses={{}} />)
    expect(container).toMatchSnapshot()
  })

  test('can select application', () => {
    const onSelectMock = jest.fn()
    const { getByText } = render(
      <AppDApplicationSelector applications={applicationsMock} statuses={{}} onSelect={onSelectMock} />
    )
    fireEvent.click(getByText('app3'))
    expect(onSelectMock).toHaveBeenCalled()
    expect(onSelectMock.mock.calls[0][0]).toEqual(333)
  })
})
