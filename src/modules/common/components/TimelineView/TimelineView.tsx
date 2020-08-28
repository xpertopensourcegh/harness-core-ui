import React from 'react'
import { Text } from '@wings-software/uikit'
import isUndefined from 'lodash/isUndefined'
import moment from 'moment'
import classnames from 'classnames'
import TimelineBar from './TimelineBar'
import styles from './TimelineView.module.scss'

interface RowConfig {
  name?: string
  data: Array<{
    startDate: string | number | Date
    endDate?: string | number | Date
    [x: string]: any
  }>
  className?: string
}

export interface TimelineViewProps {
  startDate: string | number | Date
  endDate: string | number | Date
  rows: Array<RowConfig>
  renderItem(item: any): JSX.Element
  className?: string
  labelsWidth?: number
  hideTimelineBar?: boolean
  rowHeight?: number
}

export default function TimelineView({
  startDate,
  endDate,
  rows,
  renderItem,
  className,
  labelsWidth = 125,
  hideTimelineBar = false,
  rowHeight = 50
}: TimelineViewProps) {
  const start = moment(startDate)
  const end = moment(endDate)
  const distance = end.diff(start)

  const leftPosition = (itemStartDate: any) => (100 * itemStartDate.diff(start)) / distance
  const rightPosition = (itemEndDate: any) => (100 * end.diff(itemEndDate)) / distance

  const showLabels = rows.some(row => !isUndefined(row.name))

  return (
    <div className={classnames(styles.timelineView, className)}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.timelineRow} style={{ height: rowHeight }}>
          {showLabels && (
            <span className={styles.nameWrapper}>
              <Text width={labelsWidth}>{row.name}</Text>
            </span>
          )}
          <div className={styles.rowItems}>
            {row.data.map((item, itemIndex) => (
              <div
                key={itemIndex}
                style={{
                  left: `${leftPosition(moment(item.startDate))}%`,
                  right: `${rightPosition(moment(item.endDate || item.startDate))}%`
                }}
                className={styles.rowItem}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      ))}
      {!hideTimelineBar && (
        <TimelineBar
          style={showLabels ? { marginLeft: labelsWidth } : undefined}
          className={styles.timelineViewBar}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  )
}
