import React from 'react'
import cx from 'classnames'
import { Spinner } from '@blueprintjs/core'

import { LogLineChunk, memoizedAnsiToJson } from './LogLine'
import type { LineData } from './types'
import css from './MultiLogsViewer.module.scss'

export interface SimpleLogViewerProps {
  data: string
  className?: string
  loading?: boolean
}

export function SimpleLogViewer(props: SimpleLogViewerProps): React.ReactElement {
  const { data = '', className, loading } = props
  const linesData = React.useMemo(() => {
    return data.split(/\r?\n/).map<LineData>(line => ({
      raw: line,
      anserJson: memoizedAnsiToJson(line)
    }))
  }, [data])

  return (
    <div className={cx(css.logViewer, className)}>
      {loading ? (
        <Spinner />
      ) : (
        <pre>
          <LogLineChunk data={linesData} chunkNumber={0} linesChunkSize={0} />
        </pre>
      )}
    </div>
  )
}
