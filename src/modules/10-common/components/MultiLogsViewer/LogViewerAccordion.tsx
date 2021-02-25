import React from 'react'
import { Icon, IconName } from '@wings-software/uicore'
import { chunk } from 'lodash-es'

import { Duration } from '@common/components'

import type { LineData } from './types'
import { LogViewerWithVirtualList } from './LogViewerWithVirtualList'
import { memoizedAnsiToJson } from './LogLine'
import css from './MultiLogsViewer.module.scss'

export type LogViewerAccordionStatus = 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'NOT_STARTED' | 'LOADING' | 'QUEUED'

export interface LogViewerAccordionProps {
  title: React.ReactNode
  data: string
  startTime?: number
  endTime?: number
  id: string
  status: LogViewerAccordionStatus
  isOpen?: boolean
  linesChunkSize: number
  onSectionClick?(id: string, props: LogViewerAccordionProps): boolean | void
}

const statusIconMap: Record<LogViewerAccordionStatus, IconName> = {
  SUCCESS: 'tick-circle',
  FAILURE: 'circle-cross',
  RUNNING: 'spinner',
  QUEUED: 'spinner',
  NOT_STARTED: 'circle',
  LOADING: 'circle'
}

/**
 * Component which renders a section of a log
 */
export function LogViewerAccordion(props: LogViewerAccordionProps): React.ReactElement {
  const { title, data, isOpen, status, id, onSectionClick, linesChunkSize, startTime, endTime } = props
  const [node, setNode] = React.useState<HTMLElement | null>(null)
  const [open, setOpen] = React.useState(!!isOpen)
  const [height, setHeight] = React.useState(0)
  const observer = React.useRef<IntersectionObserver | null>(null)

  // sync `isOpen` flag
  React.useEffect(() => {
    setOpen(!!isOpen)
  }, [isOpen])

  /**
   * Create and save the data in chunks for performance reason.
   *
   * This logic should not the kept in child components becuase
   * it will be triggered on every mount and unmount
   *
   * Doing it here avoids that issue and moreover this effect
   * will only be called when the data changes
   */
  const { linesData, totalLines } = React.useMemo(() => {
    const lines = data.split(/\r?\n/).map<LineData>(line => ({
      raw: line,
      anserJson: memoizedAnsiToJson(line)
    }))

    return { linesData: chunk(lines, linesChunkSize), totalLines: lines.length }
  }, [data, linesChunkSize])

  // this effect is a hack to detect if the summary component is sticky or not
  // Detect Sticky:  https://davidwalsh.name/detect-sticky
  // Using IntersectionObserver in react hooks: https://medium.com/the-non-traditional-developer/how-to-use-an-intersectionobserver-in-a-react-hook-9fb061ac6cb5
  React.useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0 && entry.intersectionRatio < 1) {
          // if the component is in sticky mode,
          // set height equal to that of the container
          // This height will be used by children (components)
          // to sync the scrolling behaviour
          setHeight(entry.rootBounds?.height || 0)
        } else {
          // else unset it
          setHeight(0)
        }
      },
      {
        root: node?.closest(`.${css.multiLogViewer}`),
        threshold: [1]
      }
    )

    const { current: currentObserver } = observer

    if (node) {
      currentObserver.observe(node)
    }

    return () => {
      currentObserver.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node])

  /**
   * Toggle the accordion
   */
  function toggleStatus(): void {
    const ret = onSectionClick?.(id, props)

    if (ret !== false) {
      setOpen(e => {
        return !e
      })
    }
  }

  const isLoading = status === 'LOADING'

  return (
    <div className={css.logViewerSection} data-open={open} data-status={status?.toLowerCase()}>
      <div className={css.sectionSummary} ref={setNode} onClick={toggleStatus}>
        <Icon className={css.chevron} name={isLoading ? 'spinner' : 'chevron-right'} />
        <Icon
          className={css.status}
          name={status && status in statusIconMap ? statusIconMap[status] : 'circle'}
          size={12}
        />
        <div className={css.text}>
          <div>{title}</div>
          {startTime ? (
            <Duration className={css.duration} durationText=" " startTime={startTime} endTime={endTime} />
          ) : null}
        </div>
      </div>
      {open ? (
        <LogViewerWithVirtualList
          data={linesData}
          height={height}
          id={id}
          totalLines={totalLines}
          linesChunkSize={linesChunkSize}
        />
      ) : (
        <div />
      )}
    </div>
  )
}
