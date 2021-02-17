import { ResizeSensor } from '@blueprintjs/core'
import React from 'react'
import { VariableSizeList as List } from 'react-window'
import { throttle } from 'lodash-es'

import { LogLineChunk } from './LogLine'
import type { LineData } from './types'
import css from './MultiLogsViewer.module.scss'
import './ansi-colors.scss'

export interface LogViewerWithVirtualListProps {
  data: LineData[][]
  height: number
  id: string
  totalLines: number
  linesChunkSize: number
}

const LINE_HEIGHT = 20

/**
 * Component which renders the logs inside a virtual list
 */
export function LogViewerWithVirtualList(props: LogViewerWithVirtualListProps): React.ReactElement {
  const { data, height, totalLines, linesChunkSize } = props
  const [node, setNode] = React.useState<HTMLDivElement | null>(null)
  const [preNode, setPreNode] = React.useState<HTMLPreElement | null>(null)

  const [width, setWidth] = React.useState(100)
  const listRef = React.useRef<List | null>(null)
  const scrollRef = React.useRef<number | null>(null)
  const skipBottomScroll = React.useRef(false)

  /**
   * A throttled callback which syncs the scroll position between
   * the full height wrapper and the virtual list
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listener = React.useCallback(
    throttle(() => {
      const nodeRect = node?.getBoundingClientRect()
      const preRect = preNode?.getBoundingClientRect()

      const prevScroll = scrollRef.current
      if (typeof prevScroll === 'number' && nodeRect && nodeRect.y > prevScroll) {
        skipBottomScroll.current = true
      }

      scrollRef.current = nodeRect?.y || null

      if (nodeRect && preRect && height > 0) {
        listRef.current?.scrollTo(Math.abs(preRect.y - nodeRect.y))
      }
    }, 1000 / 60), // 60 fps
    [node, height, preNode]
  )

  // add a scroll listener on root node
  React.useEffect(() => {
    const elem = node?.closest(`.${css.logsSection}`)

    elem?.addEventListener('scroll', listener)

    return () => {
      elem?.removeEventListener('scroll', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener])

  // this resets the scroll when height is unset
  React.useEffect(() => {
    if (!height) {
      listRef.current?.scrollTo(0)
    }
  }, [height])

  //  This will scroll to bottom of section
  React.useEffect(() => {
    if (!skipBottomScroll.current) {
      node?.scrollIntoView(false)
      listRef.current?.scrollTo(totalLines * LINE_HEIGHT)
    }

    listRef.current?.resetAfterIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalLines, node, linesChunkSize])

  // total height is calculated according to the total lines.
  const totalHeight = totalLines * LINE_HEIGHT

  /**
   * The virtual list height must be minimum of the following:
   * 1. Height of the parent container (minus the summary height).
   *    This is passed from the parent.
   *    When this value is zero, we must ignore it, hence used Infinity below.
   * 2. Window height, because the virtual list cannot be longer
   *    than the viewport height at any point of time.
   * 3. Total height of the lines
   */
  const listHeight = Math.min(height || Infinity, window.innerHeight, totalHeight)

  // we use ResizeSensor to use full width for the virtual list.
  return (
    <ResizeSensor onResize={([e]) => setWidth(e.contentRect.width)}>
      <div className={css.logViewer} ref={setNode} style={{ height: `${totalHeight}px` }}>
        <pre ref={setPreNode}>
          <List
            ref={listRef}
            className={css.list}
            height={listHeight}
            width={width}
            itemCount={data.length}
            estimatedItemSize={linesChunkSize * LINE_HEIGHT}
            itemSize={index => data[index].length * LINE_HEIGHT}
          >
            {({ index, style }) => {
              return (
                <LogLineChunk
                  key={index}
                  data={data[index]}
                  linesChunkSize={linesChunkSize}
                  chunkNumber={index}
                  style={style}
                />
              )
            }}
          </List>
        </pre>
      </div>
    </ResizeSensor>
  )
}
