import React from 'react'

import { LogViewerAccordion, LogViewerAccordionProps, LogViewerAccordionStatus } from './LogViewerAccordion'
import css from './MultiLogsViewer.module.scss'

export type MultiLogsViewerData = Omit<LogViewerAccordionProps, 'onSectionClick' | 'linesChunkSize'>

export type { LogViewerAccordionStatus, LogViewerAccordionProps }

export interface MultiLogsViewerProps {
  /**
   * data for the component.
   */
  data: MultiLogsViewerData[]
  /**
   * Callback triggered on click of a section summary.
   *
   * You can return `false` from this function to use
   * the component in controlled mode.
   */
  onSectionClick?: LogViewerAccordionProps['onSectionClick']
  /**
   * Chunk size for the lines to be split into.
   *
   * @default 100
   */
  linesChunkSize?: number
}

export function MultiLogsViewer(props: MultiLogsViewerProps): React.ReactElement {
  const { data, onSectionClick, linesChunkSize = 100 } = props

  return (
    <div className={css.multiLogViewer}>
      <div className={css.logsSection}>
        {data.map(row => {
          return (
            <LogViewerAccordion key={row.id} {...row} onSectionClick={onSectionClick} linesChunkSize={linesChunkSize} />
          )
        })}
      </div>
    </div>
  )
}
