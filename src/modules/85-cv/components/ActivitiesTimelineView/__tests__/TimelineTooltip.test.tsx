import React from 'react'
import { Container } from '@wings-software/uicore'
import { render, waitFor } from '@testing-library/react'
import { TimelineTooltip, verificationResultToIcon } from '../TimelineTooltip'
import type { EventData } from '../ActivitiesTimelineView'

const MockEventData: EventData[] = [
  {
    startTime: Date.now(),
    name: 'solo-dolo-activity',
    verificationResult: 'ERROR'
  },
  {
    startTime: Date.now(),
    name: 'solo-dolo-activity_1',
    verificationResult: 'VERIFICATION_FAILED'
  },
  {
    startTime: Date.now(),
    name: 'solo-dolo-activity_2',
    verificationResult: 'VERIFICATION_PASSED'
  },
  {
    startTime: Date.now(),
    name: 'solo-dolo-activity_3',
    verificationResult: 'IN_PROGRESS'
  },
  {
    startTime: Date.now(),
    name: 'solo-dolo-activity_4',
    verificationResult: 'NOT_STARTED'
  }
]

describe('Unit tests for timeline tooltip', () => {
  test('Ensure passed in child is rendered', async () => {
    const { container } = render(
      <TimelineTooltip items={MockEventData}>
        <Container className="someDiv" height={50} width={50} />
      </TimelineTooltip>
    )

    await waitFor(() => expect(container.querySelector('.someDiv'))?.not.toBeNull())
  })

  test('Ensure correct icons are returned based on verification type', async () => {
    expect(verificationResultToIcon(MockEventData[0].verificationResult)).toEqual('deployment-failed-legacy')
    expect(verificationResultToIcon(MockEventData[1].verificationResult)).toEqual('deployment-failed-legacy')
    expect(verificationResultToIcon(MockEventData[2].verificationResult)).toEqual('deployment-success-legacy')
    expect(verificationResultToIcon(MockEventData[3].verificationResult)).toEqual('deployment-inprogress-legacy')
    expect(verificationResultToIcon(MockEventData[4].verificationResult)).toEqual('deployment-inprogress-legacy')
  })
})
