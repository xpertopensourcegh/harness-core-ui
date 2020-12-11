import React from 'react'
import { waitFor, render } from '@testing-library/react'
import { DashboardWidgetMetricNav } from '../DashboardWidgetMetricNav'

describe('unit tests for dashboard widget metric', () => {
  test('Ensure content is rendered', async () => {
    const { container } = render(<DashboardWidgetMetricNav />)
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
  })
})
