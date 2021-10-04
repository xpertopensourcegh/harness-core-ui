import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ServiceDependenciesLegend from '../ServiceDependenciesLegend'

describe('ServiceDependenciesLegend Tests', () => {
  test('should render ServiceDependenciesLegend component with correct labels', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <ServiceDependenciesLegend />
      </TestWrapper>
    )
    await waitFor(() =>
      expect(getByText('cv.monitoredServices.serviceHealth.serviceDependencies.states.unhealthy')).toBeTruthy()
    )
    await waitFor(() =>
      expect(getByText('cv.monitoredServices.serviceHealth.serviceDependencies.states.needsAttention')).toBeTruthy()
    )
    await waitFor(() =>
      expect(getByText('cv.monitoredServices.serviceHealth.serviceDependencies.states.observe')).toBeTruthy()
    )
    await waitFor(() =>
      expect(getByText('cv.monitoredServices.serviceHealth.serviceDependencies.states.healthy')).toBeTruthy()
    )
    await waitFor(() => expect(getByText('na')).toBeTruthy())
    expect(container).toMatchSnapshot()
  })
})
