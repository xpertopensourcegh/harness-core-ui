import React from 'react'
import SplitPane, { Pane, SplitPaneProps } from 'react-split-pane'
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'
import { Button } from '@wings-software/uikit'
import { debounce } from 'lodash-es'

import { useExecutionContext } from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'
import { isExecutionNotStarted } from 'modules/cd/pages/execution/ExecutionUtils'

import ExecutionGraph from './ExecutionGraph/ExecutionGraph'
import ExecutionStageDetails from './ExecutionStageDetails/ExecutionStageDetails'
import ExecutionStepDetails, { DetailsViewState } from './ExecutionStepDetails/ExecutionStepDetails'
import { getRunningStage, getRunningStep } from './ExecutionGraphViewUtils'

import css from './ExecutionGraphView.module.scss'

const RESIZER_POSITION_DELTA = 8
export const PANEL_RESIZE_DELTA = 50
export const MIN_PANEL_SIZE = 200

const splitPaneProps: Partial<Record<DetailsViewState, SplitPaneProps>> = {
  [DetailsViewState.RIGHT]: {
    split: 'vertical',
    defaultSize: 570,
    minSize: 300,
    maxSize: -300,
    primary: 'second'
  },
  [DetailsViewState.BOTTOM]: {
    split: 'horizontal',
    defaultSize: 300,
    minSize: 200,
    maxSize: -100,
    primary: 'first'
  }
}

export default function ExecutionGraphView(): React.ReactElement {
  const [detailsViewState, setDetailsViewState] = React.useState(DetailsViewState.NONE)
  const [stageSplitPaneSize, setStageSplitPaneSize] = React.useState(250)
  const [stepSplitPaneSize, setStepSplitPaneSize] = React.useState(250)
  const [autoSelectedStageId, setAutoSelectedStageId] = React.useState('')
  const [autoSelectedStepId, setAutoSelectedStepId] = React.useState('')
  const resizerRef = React.useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const history = useHistory()
  const { pipelineExecutionDetail, pipelineStagesMap } = useExecutionContext()
  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setStageSplitPaneSizeDebounce = React.useCallback(debounce(setStageSplitPaneSize, 300), [setStageSplitPaneSize])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setStepSplitPaneSizeDebounce = React.useCallback(debounce(setStepSplitPaneSize, 300), [setStepSplitPaneSize])

  // show the current running stage and steps automatically
  React.useEffect(() => {
    // if user has selected a stage/step do not auto-update
    if (queryParams.stage || queryParams.step) return

    const runningStage = getRunningStage(
      pipelineExecutionDetail?.pipelineExecution?.stageExecutionSummaryElements || []
    )

    const runningStep = getRunningStep(pipelineExecutionDetail?.stageGraph || {})

    if (runningStage) {
      setAutoSelectedStageId(runningStage)
    }

    if (runningStep) {
      setAutoSelectedStepId(runningStep)
    }
  }, [
    queryParams.stage,
    queryParams.step,
    pipelineExecutionDetail?.pipelineExecution?.stageExecutionSummaryElements,
    pipelineExecutionDetail?.stageGraph
  ])

  // open details panel when a step is selected by user
  React.useEffect(() => {
    if (queryParams.step && detailsViewState === DetailsViewState.NONE) {
      setDetailsViewState(DetailsViewState.RIGHT)
    }
  }, [queryParams.step, detailsViewState])

  // handle layout change
  React.useEffect(() => {
    if (detailsViewState === DetailsViewState.RIGHT) {
      setStepSplitPaneSize(500)
    } else if (detailsViewState === DetailsViewState.BOTTOM) {
      setStepSplitPaneSize(300)
    }
  }, [detailsViewState])

  function handleStepSelection(step: string): void {
    const selectedStep = pipelineExecutionDetail?.stageGraph?.nodeMap?.[step]

    if (isExecutionNotStarted(selectedStep?.status)) {
      return
    }

    const params = {
      ...qs.parse(location.search, { ignoreQueryPrefix: true }),
      stage: (queryParams.stage as string) || autoSelectedStageId,
      step
    }

    history.push(`${location.pathname}?${qs.stringify(params)}`)
  }

  function handleStageSelection(stage: string): void {
    const selectedStage = pipelineStagesMap.get(stage)

    if (isExecutionNotStarted(selectedStage?.executionStatus)) {
      return
    }

    const params = {
      ...qs.parse(location.search, { ignoreQueryPrefix: true }),
      stage,
      step: [] // empty array will remove the key
    }
    setAutoSelectedStageId(stage)
    history.push(`${location.pathname}?${qs.stringify(params)}`)
  }

  function handleStageResize(size: number): void {
    window.requestAnimationFrame(() => {
      if (resizerRef.current) {
        resizerRef.current.style.transform = `translateY(${size - RESIZER_POSITION_DELTA}px)`
      }
    })

    setStageSplitPaneSizeDebounce(size)
  }

  const stageExecutionDetails = (
    <ExecutionStageDetails
      onStepSelect={handleStepSelection}
      onStageSelect={handleStageSelection}
      selectedStage={(queryParams.stage as string) || autoSelectedStageId}
      selectedStep={(queryParams.step as string) || autoSelectedStepId}
    />
  )

  const stepDetails =
    detailsViewState === DetailsViewState.NONE ? null : (
      <ExecutionStepDetails
        selectedStep={(queryParams.step as string) || autoSelectedStepId}
        viewState={detailsViewState}
        onViewStateChange={setDetailsViewState}
      />
    )

  return (
    <div className={css.main}>
      <div
        className={css.resizers}
        ref={resizerRef}
        style={{ transform: `translateY(${stageSplitPaneSize - RESIZER_POSITION_DELTA}px)` }}
      >
        <Button
          icon="up"
          minimal
          small
          iconProps={{ size: 12 }}
          onClick={() => setStageSplitPaneSize(MIN_PANEL_SIZE)}
        />
        <Button
          icon="down"
          minimal
          small
          iconProps={{ size: 12 }}
          onClick={() => setStageSplitPaneSize(size => size + PANEL_RESIZE_DELTA)}
        />
      </div>
      <SplitPane split="horizontal" minSize={MIN_PANEL_SIZE} size={stageSplitPaneSize} onChange={handleStageResize}>
        <Pane className={css.executionGraphPane}>
          <ExecutionGraph
            onSelectedStage={handleStageSelection}
            selectedStage={(queryParams.stage as string) || autoSelectedStageId}
            graphSize={stageSplitPaneSize}
          />
        </Pane>
        <Pane className={css.fullHeight}>
          {detailsViewState === DetailsViewState.BOTTOM || detailsViewState === DetailsViewState.RIGHT ? (
            <SplitPane
              className={css.executionStageSplitPane}
              {...splitPaneProps[detailsViewState]}
              size={stepSplitPaneSize}
              onChange={setStepSplitPaneSizeDebounce}
            >
              <Pane className={css.executionStagePane}>{stageExecutionDetails}</Pane>
              <Pane className={css.fullHeight}>{stepDetails}</Pane>
            </SplitPane>
          ) : (
            <React.Fragment>
              {stageExecutionDetails}
              {stepDetails}
            </React.Fragment>
          )}
        </Pane>
      </SplitPane>
    </div>
  )
}
