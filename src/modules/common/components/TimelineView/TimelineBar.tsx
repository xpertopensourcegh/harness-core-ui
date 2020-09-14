import React, { useState, useEffect, useRef, useMemo } from 'react'
import * as Moment from 'moment'
import { extendMoment, DateRange } from 'moment-range'
import classnames from 'classnames'
import styles from './TimelineView.module.scss'

const moment = extendMoment(Moment)

interface TimelineBarProps {
  startDate: string | number | Date
  endDate: string | number | Date
  className?: string
  style?: object
}

const TIME_UNITS = [
  { unit: 'minutes', step: 1, format: 'h:mm A' },
  { unit: 'minutes', step: 2, format: 'h:mm A' },
  { unit: 'minutes', step: 5, format: 'h:mm A' },
  { unit: 'minutes', step: 10, format: 'h:mm A' },
  { unit: 'minutes', step: 15, format: 'h:mm A' },
  { unit: 'minutes', step: 30, format: 'h:mm A' },
  { unit: 'hours', step: 1, format: 'h:mm A' },
  { unit: 'hours', step: 2, format: 'h:mm A' },
  { unit: 'hours', step: 4, format: 'h:mm A' },
  { unit: 'hours', step: 12, format: 'h:mm A' },
  { unit: 'days', step: 1, format: 'MMM D' },
  { unit: 'days', step: 2, format: 'MMM D' },
  { unit: 'weeks', step: 1, format: 'MMM D' },
  { unit: 'months', step: 1, format: 'MMM' },
  { unit: 'months', step: 4, format: 'MMM' },
  { unit: 'years', step: 1, format: 'YYYY' }
]

const HOURS_STARTING_INDEX = TIME_UNITS.findIndex(({ unit }) => unit === 'hours')
const DAYS_STARTING_INDEX = TIME_UNITS.findIndex(({ unit }) => unit === 'days')

/**
 * This method finds the best starting point for certain range.
 * If the range is too wide, the goal is to avoid recreating increments of small units.
 * It's just performance optimization and it would work if starting point was always zero.
 */
const findOptimalStartingIndex = (range: DateRange): number => {
  let start = 0
  if (range.diff('days') > 0) {
    /** Start with hours */
    start = HOURS_STARTING_INDEX
    if (range.diff('days') > 10) {
      /** start with days */
      start = DAYS_STARTING_INDEX
    }
  }
  return start
}

const MIN_COL_SIZE = 50

export default function TimelineBar({ startDate, endDate, className, style }: TimelineBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)

  const onResize = () => {
    if (ref.current) {
      setSize(ref.current.getBoundingClientRect().width)
    }
  }

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const items = useMemo(() => {
    if (size === 0) {
      return []
    }
    const range = moment.range(moment(startDate), moment(endDate))

    for (let i = findOptimalStartingIndex(range); i < TIME_UNITS.length; i++) {
      const timeUnit = TIME_UNITS[i]
      const rangeItems = Array.from(range.by(timeUnit.unit as any, { step: timeUnit.step }))
      const colSize = size / rangeItems.length
      if (colSize >= MIN_COL_SIZE) {
        return rangeItems.map((item: any) => ({
          formattedValue: item.format(timeUnit.format),
          originalValue: item
        }))
      }
    }
    return []
  }, [size, startDate, endDate])

  /**
   * TODO - although the coeff is calculated correctly, if there is not enough space to render
   * the last label, it will push everything little bit to the left (just enough to render the text).
   * Find a better way to handle this edge case.
   */
  let lastItemCoeff = 0
  if (items.length >= 2) {
    const limit = moment(endDate)
    if (limit.isAfter(items[items.length - 1].originalValue)) {
      const a = items[items.length - 1].originalValue.diff(items[items.length - 2].originalValue)
      const b = limit.diff(items[items.length - 1].originalValue)
      lastItemCoeff = b / a
    }
  }
  return (
    <div ref={ref} style={style} className={classnames(styles.timelineBar, className)}>
      {items.map((item, i) => (
        <div
          key={i}
          style={i === items.length - 1 ? { flex: lastItemCoeff } : undefined}
          className={styles.timelineBarItem}
        >
          {item.formattedValue}
        </div>
      ))}
    </div>
  )
}
