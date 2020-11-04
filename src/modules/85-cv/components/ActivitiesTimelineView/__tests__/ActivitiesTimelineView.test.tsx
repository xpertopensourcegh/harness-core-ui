import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import ActivitiesTimelineView, { MockedActivitiesTimelineView, ActivitiesFlagBorder } from '../ActivitiesTimelineView'

jest.mock('moment', () => {
  const original = jest.requireActual('moment')
  original().__proto__.format = () => 'XX:YY'
  return original
})

describe('ActivitiesTimelineView', () => {
  beforeAll(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      height: 10,
      width: 300,
      x: 0,
      y: 0,
      toJSON: jest.fn()
    }))
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  test('matches snapshot', () => {
    const { container } = render(<MockedActivitiesTimelineView />)
    expect(container).toMatchSnapshot()
  })

  test('renders batch correctly, and can zoom-in', () => {
    const { container } = render(
      <ActivitiesTimelineView
        startTime={1602590400000}
        endTime={1602604800000}
        canSelect
        deployments={[
          { startTime: 1602592200000, name: 'DB Integration 1001', verificationResult: 'VERIFICATION_PASSED' },
          { startTime: 1602592200000, name: 'DB Integration 1002', verificationResult: 'VERIFICATION_FAILED' }
        ]}
      />
    )
    expect(container.querySelector('.eventBatch')).toBeDefined()
    const oldBarLabelsCount = container.querySelector('.timelineBar')?.children.length
    act(() => {
      fireEvent.click(container.querySelector('.eventBatch .itemsGroup')!)
    })
    expect(container.querySelector('.timelineBar')?.children.length).toEqual(oldBarLabelsCount)
  })

  test('can select activity', () => {
    const { container } = render(
      <ActivitiesTimelineView
        startTime={1602590400000}
        endTime={1602604800000}
        canSelect
        deployments={[
          { startTime: 1602592200000, name: 'DB Integration 1001', verificationResult: 'VERIFICATION_PASSED' }
        ]}
      />
    )
    act(() => {
      fireEvent.click(container.querySelector('.eventItem svg')!)
    })
    expect(container.querySelector('.timeline-flag-target')).toBeDefined()
  })

  test('ActivitiesFlagBorder matches snapshot', () => {
    const { container } = render(<ActivitiesFlagBorder />)
    expect(container).toMatchSnapshot()
  })
})
