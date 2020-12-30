import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { ActivityTimelineScrubber } from '../ActivityTimelineScrubber'

const MockData = [
  [
    {
      activityName: '1 Normal kubernetes events',
      activityStatus: 'IN_PROGRESS',
      activityType: 'DEPLOYMENT',
      environmentName: null,
      progress: 0,
      riskScore: -1,
      serviceIdentifier: 'VerificationService',
      startTime: 1608773880000,
      uuid: '1'
    },
    {
      activityName: '1 Normal kubernetes events',
      activityStatus: 'VERIFICATION_FAILED',
      activityType: 'DEPLOYMENT',
      environmentName: null,
      progress: 100,
      riskScore: 0.5559231638720785,
      serviceIdentifier: 'VerificationService',
      startTime: 1608641040000,
      uuid: '2'
    },
    {
      activityName: '1 Normal kubernetes events',
      activityStatus: 'VERIFICATION_PASSED',
      activityType: 'DEPLOYMENT',
      environmentName: null,
      progress: 100,
      riskScore: 0.035310950332179514,
      serviceIdentifier: 'Manager',
      startTime: 1608312600000,
      uuid: '3'
    }
  ]
]

describe('ActivityTimelineScrubber unit tests', () => {
  const boundClientRefOriginal = Element.prototype.getBoundingClientRect
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 1000,
        height: 500,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      } as any
    })
  })
  afterAll(() => {
    Element.prototype.getBoundingClientRect = boundClientRefOriginal
  })
  test('Ensure events are plotted with correct colors', async () => {
    const { container } = render(
      <ActivityTimelineScrubber
        onScrubberPositionChange={jest.fn()}
        scrubberData={MockData}
        scrubberLaneRef={jest.fn()}
        scrubberRef={jest.fn()}
        timelineContainerRef={document.createElement('div')}
        timelineEndTime={1606809600000}
        timelineStartTime={1609274100000}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="scrubberLaneContainer"]')).not.toBeNull())
    const allActivities = container.querySelectorAll('[class*="activityDot"]')
    expect(allActivities.length).toBe(3)
    expect(allActivities[0].getAttribute('class')).toContain('background-blue500')
    expect(allActivities[1].getAttribute('class')).toContain('background-red500')
    expect(allActivities[2].getAttribute('class')).toContain('background-green500')
  })
})
