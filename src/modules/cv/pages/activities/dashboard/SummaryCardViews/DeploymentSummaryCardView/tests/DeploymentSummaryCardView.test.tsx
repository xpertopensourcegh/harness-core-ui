import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Utils } from '@wings-software/uikit'
import { Classes } from '@blueprintjs/core'
import { DeploymentSummaryCardView } from '../DeploymentSummaryCardView'

const MockActivity = {
  startTime: Date.now(),
  progress: Math.floor(Math.random() * 100),
  activityName: 'Build 78',
  activityType: 'Deployment',
  activitySummaryText: 'Delegate',
  uuid: Utils.randomId()
}

describe('Unit tests for Deployment summary card view', () => {
  test('Ensure deployment summary card view renders', async () => {
    const { container, getByText } = render(<DeploymentSummaryCardView selectedActivity={MockActivity} />)
    await waitFor(() => getByText('Build 78'))
    expect(container.querySelector('[class*="activityTypeIcon"]')).not.toBeNull()
    expect(container.querySelector(`.${Classes.PROGRESS_BAR}`)).not.toBeNull()
    expect(container.querySelector(`.${Classes.INTENT_DANGER}`)).not.toBeNull()
  })
})
