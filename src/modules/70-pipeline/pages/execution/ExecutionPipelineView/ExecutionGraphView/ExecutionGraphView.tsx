import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'

import { useExecutionContext } from '../../ExecutionContext/ExecutionContext'
import { isExecutionNotStarted } from '../../ExecutionUtils'
import ExecutionLayout from '../../../../components/ExecutionLayout/ExecutionLayout'

import ExecutionGraph from './ExecutionGraph/ExecutionGraph'
import ExecutionStageDetails from './ExecutionStageDetails/ExecutionStageDetails'
import ExecutionStepDetails from './ExecutionStepDetails/ExecutionStepDetails'

import css from './ExecutionGraphView.module.scss'

export const PANEL_RESIZE_DELTA = 50
export const MIN_PANEL_SIZE = 200

export default function ExecutionGraphView(): React.ReactElement {
  const location = useLocation()
  const history = useHistory()
  const {
    pipelineExecutionDetail,
    pipelineStagesMap,
    autoSelectedStageId,
    autoSelectedStepId,
    queryParams
  } = useExecutionContext()

  function handleStepSelection(step: string): void {
    const selectedStep = pipelineExecutionDetail?.stageGraph?.nodeMap?.[step]

    if (isExecutionNotStarted(selectedStep?.status)) {
      return
    }

    const params = {
      ...queryParams,
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
      ...queryParams,
      stage,
      step: [] // empty array will remove the key
    }

    history.push(`${location.pathname}?${qs.stringify(params)}`)
  }

  return (
    <ExecutionLayout className={css.main}>
      <ExecutionGraph
        onSelectedStage={handleStageSelection}
        selectedStage={(queryParams.stage as string) || autoSelectedStageId}
      />
      <ExecutionStageDetails
        onStepSelect={handleStepSelection}
        onStageSelect={handleStageSelection}
        selectedStage={(queryParams.stage as string) || autoSelectedStageId}
        selectedStep={(queryParams.step as string) || autoSelectedStepId}
      />
      <ExecutionStepDetails selectedStep={(queryParams.step as string) || autoSelectedStepId} />
    </ExecutionLayout>
  )
}
