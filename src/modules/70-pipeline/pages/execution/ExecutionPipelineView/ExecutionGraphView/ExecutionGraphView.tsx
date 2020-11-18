import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'

import { isExecutionNotStarted } from '@pipeline/utils/statusHelpers'
import ExecutionLayout from '@pipeline/components/ExecutionLayout/ExecutionLayout'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'

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
    selectedStageId,
    selectedStepId,
    queryParams
  } = useExecutionContext()

  function handleStepSelection(step?: string): void {
    if (!step) {
      const params = {
        ...queryParams,
        step: []
      }

      history.push(`${location.pathname}?${qs.stringify(params)}`)
    } else {
      const selectedStep = pipelineExecutionDetail?.stageGraph?.nodeMap?.[step]

      if (isExecutionNotStarted(selectedStep?.status)) {
        return
      }

      const params = {
        ...queryParams,
        stage: selectedStageId,
        step
      }

      history.push(`${location.pathname}?${qs.stringify(params)}`)
    }
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
      <ExecutionGraph onSelectedStage={handleStageSelection} selectedStage={selectedStageId} />
      <ExecutionStageDetails
        onStepSelect={handleStepSelection}
        onStageSelect={handleStageSelection}
        selectedStage={selectedStageId}
        selectedStep={selectedStepId}
      />
      <ExecutionStepDetails selectedStep={selectedStepId} />
    </ExecutionLayout>
  )
}
