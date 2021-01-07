import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Classes } from '@blueprintjs/core'
import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import useAnalysisDrillDownView from '../useAnalysisDrillDownView'

jest.mock('@cv/components/CVAnalysisTabs/CVAnalysisTabs', () => ({
  CVAnalysisTabs: function MockComponent() {
    return <Container className="CVAnalysisTabs" />
  }
}))

function WrapperComponent(): JSX.Element {
  const { openDrillDown, closeDrillDown } = useAnalysisDrillDownView()
  return (
    <Container>
      <button
        onClick={() => {
          openDrillDown({
            categoryRiskScore: 35,
            analysisProps: { startTime: 1604451600000, endTime: 1604471400000 }
          })
        }}
        className="openModal"
      />
      <button className="closeModal" onClick={() => closeDrillDown()} />
    </Container>
  )
}

describe('Unit tests for useAnalysisDrillDownView', () => {
  test('Ensure hook can be used to open and close modal', async () => {
    const { container } = render(
      <TestWrapper>
        <WrapperComponent />
      </TestWrapper>
    )
    const openButton = container.querySelector('.openModal')
    if (!openButton) {
      throw Error('open button was not found.')
    }
    fireEvent.click(openButton)
    await waitFor(() => expect(document.body.querySelector(`.${Classes.DIALOG}`)).not.toBeNull())

    const categoriesAndRisk = document.body.querySelector('[class*="categoryAndRiskScore"]')
    if (!categoriesAndRisk) {
      throw Error('Modal was not rendered.')
    }

    expect(categoriesAndRisk.children[0]?.getAttribute('class')).toContain('heatmapColor4')
    expect(document.body.querySelector('[class*="timeRange"]')?.innerHTML).toEqual(
      'Selected time interval:  Nov 4, 1:00 am - Nov 4, 6:30 am'
    )

    const closeModal = container.querySelector('.closeModal')
    if (!closeModal) {
      throw Error('open button was not found.')
    }
    fireEvent.click(closeModal)
    await waitFor(() => expect(document.body.querySelector(`.${Classes.DIALOG}`)).toBeNull())
  })
})
