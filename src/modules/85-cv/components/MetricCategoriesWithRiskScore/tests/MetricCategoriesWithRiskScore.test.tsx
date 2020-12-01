import { render, waitFor } from '@testing-library/react'
import React from 'react'
import type { CategoryRisk } from 'services/cv'
import { MetricCategoriesWithRiskScore, CategoriesWithRiskScoreProps } from '../MetricCategoriesWithRiskScore'

describe('Unit tests for MetricCategoriesWithRiskScore', () => {
  test('Ensure handles no data and data cases', async () => {
    // undefined as catgories
    const { container, rerender } = render(
      <MetricCategoriesWithRiskScore
        categoriesWithRiskScores={(undefined as unknown) as CategoriesWithRiskScoreProps['categoriesWithRiskScores']}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(container.querySelector('[class*="infoContainer"]')).toBeNull()

    // no data
    rerender(<MetricCategoriesWithRiskScore categoriesWithRiskScores={[]} />)
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(container.querySelector('[class*="infoContainer"]')).toBeNull()

    // with data
    rerender(
      <MetricCategoriesWithRiskScore
        categoriesWithRiskScores={[
          { category: 'Infrastructure' as CategoryRisk['category'], risk: 45 },
          { category: 'Errors' as CategoryRisk['category'], risk: 20 },
          { category: 'Performance' as CategoryRisk['category'], risk: 34 }
        ]}
      />
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const infoContainers = container.querySelectorAll('[class*="infoContainer"]')
    expect(infoContainers.length).toBe(3)
    expect(infoContainers[0].children[0].innerHTML).toEqual('Perf')
    expect(infoContainers[1].children[0].innerHTML).toEqual('Err')
    expect(infoContainers[2].children[0].innerHTML).toEqual('Infra')
  })
})
