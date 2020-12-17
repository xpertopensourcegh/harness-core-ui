import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import CVProductCard from '../CVProductCard'

describe('CVProductCard', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <CVProductCard
        item={{
          icon: 'edit',
          title: 'testName',
          iconSize: 20
        }}
        selected
      />
    )

    expect(container).toMatchSnapshot()
  })

  test('fires click callback', () => {
    const onClick = jest.fn()
    const { container } = render(
      <CVProductCard
        item={{
          icon: 'edit',
          title: 'testName'
        }}
        onClick={onClick}
        selected
      />
    )
    fireEvent.click(container.querySelector('svg')!)
    expect(onClick).toHaveBeenCalled()
  })
})
