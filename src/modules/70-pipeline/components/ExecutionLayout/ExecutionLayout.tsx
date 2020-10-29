import React from 'react'
import SplitPane, { Pane, SplitPaneProps } from 'react-split-pane'
import { Button } from '@wings-software/uikit'
import { debounce } from 'lodash-es'
import cx from 'classnames'

import { ExecutionLayoutContext, ExecutionLayoutState } from './ExecutionLayoutContext'
import ExecutionLayoutFloatingView from './ExecutionLayoutFloatingView'
import ExcecutionLayoutToggle from './ExecutionLayoutToggle'

import css from './ExecutionLayout.module.scss'

const IS_TEST = process.env.NODE_ENV === 'test'
export const PANEL_RESIZE_DELTA = 50
export const MIN_PANEL_SIZE = 200
const RESIZER_POSITION_DELTA = 18
const EXECUTION_LAYOUT_DOM_ID = `execution-layout-${IS_TEST ? 'test' : /* istanbul ignore next */ Date.now()}`

const splitPaneProps: Partial<Record<ExecutionLayoutState, SplitPaneProps>> = {
  [ExecutionLayoutState.RIGHT]: {
    split: 'vertical',
    defaultSize: 570,
    minSize: 300,
    maxSize: -300,
    primary: 'second'
  },
  [ExecutionLayoutState.BOTTOM]: {
    split: 'horizontal',
    defaultSize: 300,
    minSize: 200,
    maxSize: -100,
    primary: 'first'
  }
}

export interface ExecutionLayoutProps {
  className?: string
  defaultLayout?: ExecutionLayoutState
}

export default function ExecutionLayout(props: React.PropsWithChildren<ExecutionLayoutProps>): React.ReactElement {
  const [child1, child2, child3] = React.Children.toArray(props.children)
  const [layoutState, setLayoutState] = React.useState(props.defaultLayout || ExecutionLayoutState.NONE)
  const [primaryPaneSize, setPrimaryPaneSize] = React.useState(250)
  const [teritiaryPaneSize, setTeritiaryPaneSize] = React.useState(250)
  const resizerRef = React.useRef<HTMLDivElement | null>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setStageSplitPaneSizeDebounce = React.useCallback(debounce(setPrimaryPaneSize, 300), [setPrimaryPaneSize])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setStepSplitPaneSizeDebounce = React.useCallback(debounce(setTeritiaryPaneSize, 300), [setTeritiaryPaneSize])

  /* Ignoring this function as it is used by "react-split-pane" */
  /* istanbul ignore next */
  function handleStageResize(size: number): void {
    window.requestAnimationFrame(() => {
      if (resizerRef.current) {
        resizerRef.current.style.transform = `translateY(${size - RESIZER_POSITION_DELTA}px)`
      }
    })

    setStageSplitPaneSizeDebounce(size)
  }

  // handle layout change
  React.useEffect(() => {
    if (layoutState === ExecutionLayoutState.RIGHT) {
      setTeritiaryPaneSize(500)
    } else if (layoutState === ExecutionLayoutState.BOTTOM) {
      setTeritiaryPaneSize(300)
    }
  }, [layoutState])

  return (
    <ExecutionLayoutContext.Provider
      value={{
        layout: layoutState,
        setLayout: (e: any) => setLayoutState(e),
        primaryPaneSize,
        teritiaryPaneSize,
        setPrimaryPaneSize,
        setTeritiaryPaneSize
      }}
    >
      <div className={cx(css.main, props.className)} id={EXECUTION_LAYOUT_DOM_ID}>
        <div
          className={css.resizers}
          ref={resizerRef}
          style={{ transform: `translateY(${primaryPaneSize - RESIZER_POSITION_DELTA}px)` }}
        >
          <Button icon="up" minimal small iconProps={{ size: 12 }} onClick={() => setPrimaryPaneSize(MIN_PANEL_SIZE)} />
          <Button
            icon="down"
            minimal
            small
            iconProps={{ size: 12 }}
            onClick={() => setPrimaryPaneSize(size => size + PANEL_RESIZE_DELTA)}
          />
        </div>
        <SplitPane
          split="horizontal"
          className={css.splitPane1}
          minSize={MIN_PANEL_SIZE}
          size={primaryPaneSize}
          onChange={handleStageResize}
        >
          <Pane className={css.pane11}>{child1}</Pane>
          <Pane className={css.pane12}>
            {layoutState === ExecutionLayoutState.BOTTOM || layoutState === ExecutionLayoutState.RIGHT ? (
              <SplitPane
                className={css.splitPane2}
                {...splitPaneProps[layoutState]}
                size={teritiaryPaneSize}
                onChange={setStepSplitPaneSizeDebounce}
              >
                <Pane className={css.pane21}>{child2}</Pane>
                <Pane className={css.pane22}>{child3}</Pane>
              </SplitPane>
            ) : (
              <React.Fragment>
                {child2}
                {layoutState === ExecutionLayoutState.NONE ? null : (
                  <ExecutionLayoutFloatingView>{child3}</ExecutionLayoutFloatingView>
                )}
              </React.Fragment>
            )}
          </Pane>
        </SplitPane>
      </div>
    </ExecutionLayoutContext.Provider>
  )
}

ExecutionLayout.Toggle = ExcecutionLayoutToggle
