import React from 'react'
import { render, waitFor } from '@testing-library/react'
import type { RestResponseCategoryRisksDTO } from 'services/cv'
import { CategoryRiskCards } from '../CategoryRiskCards'
import i18n from '../CategoryRiskCards.i18n'

jest.mock('../RiskCardTooltip/RiskCardTooltip', () => (props: any) => <div>{props.children}</div>)

const InvalidTimestampMockApiData: RestResponseCategoryRisksDTO = {
  metaData: {},
  resource: {
    startTimeEpoch: 0,
    endTimeEpoch: 0,
    categoryRisks: [
      { category: 'INFRASTRUCTURE', risk: 0 },
      { category: 'PERFORMANCE', risk: 0 },
      { category: 'ERRORS', risk: -1 }
    ]
  },
  responseMessages: []
}

describe('Category Risk Cards unit tests', () => {
  test('Ensure that when category risk cards gets an invalid timestamp, it is not rendered.', async () => {
    const { container, getByText } = render(<CategoryRiskCards data={InvalidTimestampMockApiData} />)
    await waitFor(() => getByText(i18n.overallText))
    getByText(i18n.productionRisk)
    expect(container.querySelector('[class*="timeRange"]')?.children.length).toBe(1)
  })

  test('Ensure that when -1 is sent as a risk value, the card is rendered in no analysis view', async () => {
    const { container, getByText } = render(<CategoryRiskCards data={InvalidTimestampMockApiData} />)
    await waitFor(() => getByText(i18n.overallText))

    const categoryRiskCards = container.querySelectorAll('[class*="categoryRiskCard"]')
    expect(categoryRiskCards.length).toBe(3)
    expect(categoryRiskCards[2].querySelector('[class*="noRiskScore"]')).not.toBeNull()
  })
})
