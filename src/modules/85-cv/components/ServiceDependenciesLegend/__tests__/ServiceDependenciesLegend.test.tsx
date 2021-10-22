import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { RiskValues, getRiskLabelStringId } from '@cv/utils/CommonUtils'
import ServiceDependenciesLegend from '../ServiceDependenciesLegend'

describe('ServiceDependenciesLegend Tests', () => {
  test('should render ServiceDependenciesLegend component with correct labels', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <ServiceDependenciesLegend />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText(getRiskLabelStringId(RiskValues.UNHEALTHY))).toBeTruthy())
    await waitFor(() => expect(getByText(getRiskLabelStringId(RiskValues.NEED_ATTENTION))).toBeTruthy())
    await waitFor(() => expect(getByText(getRiskLabelStringId(RiskValues.OBSERVE))).toBeTruthy())
    await waitFor(() => expect(getByText(getRiskLabelStringId(RiskValues.HEALTHY))).toBeTruthy())
    await waitFor(() => expect(getByText('na')).toBeTruthy())

    // should render servicetype legend
    await waitFor(() => expect(container.querySelector('.serviceTypesContainer')).toBeTruthy())

    expect(container).toMatchSnapshot()
  })

  test('should render ServiceDependenciesLegend without ServiceType legend', async () => {
    const { container } = render(
      <TestWrapper>
        <ServiceDependenciesLegend hideServiceTypeLegend />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('.serviceTypesContainer')).not.toBeTruthy())
    expect(container).toMatchSnapshot()
  })
})
