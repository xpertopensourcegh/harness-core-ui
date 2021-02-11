import React from 'react'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import type { ExecutionNode } from 'services/pipeline-ng'
import { ExecutionPathParams, getIconFromStageModule, processExecutionData } from '@pipeline/utils/executionUtils'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import { useExecutionLayoutContext } from '@pipeline/components/ExecutionLayout/ExecutionLayoutContext'
import ExecutionStageDiagram from '@pipeline/components/ExecutionStageDiagram/ExecutionStageDiagram'
import type { StageOptions, ExecutionPipeline } from '@pipeline/components/ExecutionStageDiagram/ExecutionPipelineModel'

import css from './ExecutionStageDetails.module.scss'

export interface ExecutionStageDetailsProps {
  onStepSelect(step?: string): void
  onStageSelect(step: string): void
  selectedStep: string
  selectedStage: string
}

export default function ExecutionStageDetails(props: ExecutionStageDetailsProps): React.ReactElement {
  const { pipelineExecutionDetail, pipelineStagesMap, loading } = useExecutionContext()
  const { setStepDetailsVisibility } = useExecutionLayoutContext()

  const stagesOptions: StageOptions[] = [...pipelineStagesMap].map(item => ({
    label: item[1].nodeIdentifier || /* istanbul ignore next */ '',
    value: item[1].nodeUuid || /* istanbul ignore next */ '',
    icon: { name: getIconFromStageModule(item[1].module) },
    disabled: item[1].status === 'NotStarted'
  }))
  const { executionIdentifier } = useParams<ExecutionPathParams>()
  const stage = pipelineStagesMap.get(props.selectedStage)

  const data: ExecutionPipeline<ExecutionNode> = {
    items: processExecutionData(pipelineExecutionDetail?.executionGraph),
    identifier: `${executionIdentifier}-${props.selectedStage}`,
    status: stage?.status as any
  }

  // open details view when a step is selected
  React.useEffect(() => {
    setStepDetailsVisibility(!!props.selectedStep)
  }, [props.selectedStep, setStepDetailsVisibility])
  return (
    <div className={css.main}>
      {!isEmpty(props.selectedStage) && data.items?.length > 0 && (
        <ExecutionStageDiagram
          selectedIdentifier={props.selectedStep}
          itemClickHandler={e => props.onStepSelect(e.stage.identifier)}
          data={data}
          showEndNode={stage?.status !== 'Running'}
          isWhiteBackground
          nodeStyle={{
            width: 64,
            height: 64
          }}
          loading={loading}
          gridStyle={{
            startX: 50,
            startY: 150
          }}
          showStageSelection={true}
          selectedStage={{
            label: stage?.nodeIdentifier || /* istanbul ignore next */ '',
            value: stage?.nodeUuid || /* istanbul ignore next */ '',
            icon: { name: getIconFromStageModule(stage?.module) }
          }}
          stageSelectionOptions={stagesOptions}
          onChangeStageSelection={(item: StageOptions) => {
            props.onStageSelect(item.value as string)
          }}
          canvasBtnsClass={css.canvasBtns}
        />
      )}
    </div>
  )
}
