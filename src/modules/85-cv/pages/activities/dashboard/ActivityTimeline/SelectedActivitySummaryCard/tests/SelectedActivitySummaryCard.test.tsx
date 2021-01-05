import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import type { Activity } from '../../ActivityTrack/ActivityTrackUtils'
import { SelectedActivitySummaryCard } from '../SelectedActivitySummaryCard'

const MockActivity: Activity = {
  uuid: '1234_id',
  startTime: 1609728600000
}

describe('Unit tests for SelectedActivitySummaryCard', () => {
  const boundClientRefOriginal = Element.prototype.getBoundingClientRect
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 1000,
        height: 500,
        top: 27,
        left: 0,
        bottom: 0,
        right: 0
      } as any
    })
  })
  afterAll(() => {
    Element.prototype.getBoundingClientRect = boundClientRefOriginal
  })

  test('Ensure nothing is rendered when all props are not passed', async () => {
    const { container, rerender } = render(
      <SelectedActivitySummaryCard
        selectedActivity={MockActivity}
        setCardRef={jest.fn()}
        onClose={jest.fn()}
        activityTimelineContainerRef={null}
        renderSummaryCardContent={() => <Container className="cardContentSummmary" />}
      />
    )

    // condition without selectedActivityRef
    await waitFor(() => expect(container.querySelector('[class*="container"]')).toBeNull())

    const refSpy = {
      ref: {}
    }

    // condition without selectedActivity top value
    rerender(
      <SelectedActivitySummaryCard
        selectedActivity={{ ...MockActivity, ref: refSpy as any }}
        setCardRef={jest.fn()}
        onClose={jest.fn()}
        activityTimelineContainerRef={null}
        renderSummaryCardContent={() => <Container className="cardContentSummmary" />}
      />
    )
    await waitFor(() => expect(container.querySelector('[class*="container"]')).toBeNull())

    // with no activitytimelinecontainer ref
    rerender(
      <SelectedActivitySummaryCard
        selectedActivity={{ ...MockActivity, top: 50, ref: refSpy as any }}
        setCardRef={jest.fn()}
        onClose={jest.fn()}
        activityTimelineContainerRef={null}
        renderSummaryCardContent={() => <Container className="cardContentSummmary" />}
      />
    )
    await waitFor(() => expect(container.querySelector('[class*="container"]')).toBeNull())
  })

  test('Card is rendered when activity has necessary information', async () => {
    const refSpy = {
      ref: {}
    }
    const onCloseMock = jest.fn()
    const { container } = render(
      <SelectedActivitySummaryCard
        selectedActivity={{ ...MockActivity, top: 50, ref: refSpy as any }}
        setCardRef={jest.fn()}
        onClose={onCloseMock}
        activityTimelineContainerRef={document.createElement('div')}
        renderSummaryCardContent={(_, onClose) => (
          <Container className="cardContentSummmary" onClick={() => onClose()} />
        )}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())

    const cardContent = container.querySelector('.cardContentSummmary')
    if (!cardContent) {
      throw new Error('card content was not rendered.')
    }

    expect(cardContent).not.toBeNull()
    fireEvent.click(cardContent)

    await waitFor(() => expect(onCloseMock).toHaveBeenCalled())
  })
})
