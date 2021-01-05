import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import { AnalysisDrillDownView } from '../AnalysisDrillDownView'
import i18n from '../AnalysisDrillDownView.i18n'

jest.mock('../MetricAnalysisView/MetricAnalysisView', () => ({
  MetricAnalysisView: function MockComponent() {
    return <Container className="metricAnalysisView" />
  }
}))
jest.mock('../LogAnalysisView/LogAnalysisView', () => () => <Container className="logAnalysisView" />)

describe('Unit tests for Analysis Drill down view', () => {
  test('Ensure no data card is rendered when timestamps are invalid', async () => {
    const { getByText } = render(<AnalysisDrillDownView startTime={0} endTime={0} />)
    await waitFor(() => expect(getByText(i18n.noDataText)).not.toBeNull())
  })

  test('Ensure correct tab is rendered when clicking on a tab', async () => {
    const { container } = render(<AnalysisDrillDownView startTime={Date.now()} endTime={Date.now()} />)
    await waitFor(() => expect(container.querySelector('.metricAnalysisView')).not.toBeNull())

    const tabs = container.querySelectorAll('[class*="bp3-tab-panel"]')
    expect(tabs.length).toBe(2)

    fireEvent.click(tabs[1])
    await waitFor(() => expect(container.querySelector('.logAnalysisView')).not.toBeNull())
  })
})
