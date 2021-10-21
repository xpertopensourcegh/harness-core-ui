import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import FilterCard from '../FilterCard'
import type { FilterCardItem } from '../FilterCard.types'

const filterOptions: Array<FilterCardItem> = [
  {
    title: 'All Services',
    icon: 'services',
    count: 17
  },
  {
    title: 'Services at Risk',
    icon: 'services',
    count: 2
  },
  {
    title: 'Services with Deployments',
    icon: 'nav-project',
    iconSize: 16,
    count: 5
  },
  {
    title: 'Services with Infra Changes',
    icon: 'infrastructure',
    count: 2
  },
  {
    title: 'Services with Insights',
    icon: 'warning-outline',
    iconSize: 14,
    count: 3
  }
]

const setSelectedFilter = jest.fn()

describe('Filter cards', () => {
  test('Filter cards render', () => {
    const { container } = render(
      <TestWrapper>
        <FilterCard data={filterOptions} selected={filterOptions[0]} onChange={setSelectedFilter} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test('Filter card click', async () => {
    const { container } = render(
      <TestWrapper>
        <FilterCard data={filterOptions} selected={filterOptions[0]} onChange={item => setSelectedFilter(item)} />
      </TestWrapper>
    )

    userEvent.click(container.querySelector('[data-icon="infrastructure"]')!)
    expect(setSelectedFilter).toBeCalledTimes(1)
    expect(setSelectedFilter).toBeCalledWith(filterOptions[3])
  })
})
