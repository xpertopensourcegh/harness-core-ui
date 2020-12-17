import React from 'react'
import { render } from '@testing-library/react'
import CVPagination from '../CVPagination'

describe('CVPagination', () => {
  test('Matches snapshot', () => {
    const { container } = render(
      <CVPagination
        page={{
          pageSize: 10,
          totalPages: 2,
          pageIndex: 1,
          totalItems: 18
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('Matches snapshot when page is not passed', () => {
    const { container } = render(<CVPagination />)
    expect(container).toMatchSnapshot()
  })

  test('Matches snapshot when page is emptys', () => {
    const { container } = render(<CVPagination page={{}} />)
    expect(container).toMatchSnapshot()
  })

  test('Matches snapshot when pageIndex = -1', () => {
    const { container } = render(
      <CVPagination
        page={{
          pageSize: 0,
          totalPages: 0,
          pageIndex: -1,
          totalItems: 0
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
