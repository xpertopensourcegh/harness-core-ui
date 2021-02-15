import React from 'react'
import cx from 'classnames'

import type { LineData } from './types'
import css from './MultiLogsViewer.module.scss'

export interface LogLineChunkProps {
  data: LineData[]
  chunkNumber: number
  linesChunkSize: number
  style: React.CSSProperties
}

// https://github.com/nteract/ansi-to-react/blob/master/src/index.ts
// https://github.com/bvaughn/highlight-words-core/blob/master/src/utils.js

export interface LogLineProps {
  data: LineData
  lineNumber: number
}

/**
 * Component which renders individual lines
 */
export function LogLine(props: LogLineProps): React.ReactElement {
  const {
    data: { anserJson },
    lineNumber
  } = props

  return (
    <div className={css.logLine}>
      <div className={css.lineNumber}>{lineNumber}</div>
      <div className={css.line}>
        {anserJson.map((row, i) => {
          return (
            <span
              className={cx(
                {
                  [`${row.bg}-bg`]: row.bg,
                  [`${row.fg}-fg`]: row.fg
                },
                ...(row.decorations || []).map(p => `ansi-decoration-${p}`)
              )}
              key={`${row.content}_${i}`}
            >
              {row.content}
            </span>
          )
        })}
      </div>
    </div>
  )
}

const LogLineMemoized = React.memo(LogLine, (prevProps, nextProps) => prevProps.data.raw === nextProps.data.raw)

/**
 * Component which renders bunch of lines together in the virtual list
 */
export function LogLineChunk(props: LogLineChunkProps): React.ReactElement {
  const { data, chunkNumber, linesChunkSize, style } = props

  return (
    <div style={style}>
      {data.map((row, index) => {
        return (
          <LogLineMemoized
            key={`${row.raw}-${index}`}
            data={row}
            lineNumber={linesChunkSize * chunkNumber + (1 + index)}
          />
        )
      })}
    </div>
  )
}
