import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Utils } from '@wings-software/uicore'
import { LineFromSelectedActivityCard } from '../LineFromSelectedActivityCard'

const MockActivity = {
  startTime: Date.now(),
  progress: Math.floor(Math.random() * 100),
  activityName: 'Build 78',
  activityType: 'Deployment',
  activitySummaryText: 'Delegate',
  uuid: Utils.randomId(),
  top: 10
}

let timelineContainer: HTMLDivElement
let activityCard: HTMLDivElement
let summaryCard: HTMLDivElement

describe('Unit tests for LineFromSelectedCard', () => {
  beforeAll(() => {
    timelineContainer = document.createElement('div')
    timelineContainer.setAttribute('style', 'height: 800px; width: 800px; position: relative;')
    document.body.appendChild(timelineContainer)

    activityCard = document.createElement('div')
    activityCard.setAttribute('style', 'position: absolute; top: 125px; left: 20px; width: 50px; height: 50px;')

    summaryCard = document.createElement('div')
    summaryCard.setAttribute('style', 'position: absolute; top: 110px; width: 100px; height: 100px; left: 200px;')

    timelineContainer.appendChild(activityCard)
    timelineContainer.appendChild(summaryCard)
  })
  test('Ensure line has proper width', async () => {
    const { container } = render(
      <LineFromSelectedActivityCard
        timelineContainerRef={timelineContainer}
        selectedActivitySummaryCardRef={summaryCard}
        selectedActivity={{ ...MockActivity, ref: activityCard }}
      />
    )
    await waitFor(() => {
      expect(container.querySelector('[class*="line"]')).not.toBeNull()
    })

    const lineContainer = container.querySelector('[class*="main"]')
    if (!lineContainer) {
      throw Error('Line was not rendered.')
    }
  })
})
