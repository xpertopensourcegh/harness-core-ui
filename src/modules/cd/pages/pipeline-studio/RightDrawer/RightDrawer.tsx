import React from 'react'
import { Drawer, Position } from '@blueprintjs/core'
import { v4 as uuid } from 'uuid'
import type { StepData } from 'modules/common/components/AbstractSteps/AbstractStepFactory'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { DrawerTypes } from '../PipelineContext/PipelineActions'
import { StepCommands } from '../StepCommands/StepCommands'
import { StepPalette } from '../StepPalette/StepPalette'
import { addStepOrGroup } from '../ExecutionGraph/ExecutionGraphUtil'
import { getStageFromPipeline } from '../StageBuilder/StageBuilderUtil'
import { PipelineVariables } from '../PipelineVariables/PipelineVariables'
import { PipelineTemplates } from '../PipelineTemplates/PipelineTemplates'

export const RightDrawer: React.FC = (): JSX.Element => {
  const {
    state: {
      pipeline,
      pipelineView: {
        drawerData,
        isDrawerOpened,
        splitViewData: { selectedStageId }
      },
      pipelineView
    },
    updatePipeline,
    updatePipelineView
  } = React.useContext(PipelineContext)
  const { type, data, ...restDrawerProps } = drawerData
  if (!isDrawerOpened) {
    return <></>
  }
  return (
    <Drawer
      onClose={() => {
        updatePipelineView({ ...pipelineView, isDrawerOpened: false, drawerData: { type: DrawerTypes.AddStep } })
      }}
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      hasBackdrop={false}
      size={450}
      isOpen={isDrawerOpened}
      position={Position.RIGHT}
      {...restDrawerProps}
    >
      {type === DrawerTypes.StepConfig && data?.stepConfig && data?.stepConfig.node && (
        <StepCommands
          step={data.stepConfig.node}
          onChange={item => {
            const node = data?.stepConfig?.node
            if (node) {
              node.name = item.name
              node.identifier = item.identifier
              node.spec = { ...item.spec }
              updatePipeline(pipeline)
            }
            updatePipelineView({ ...pipelineView, isDrawerOpened: false, drawerData: { type: DrawerTypes.AddStep } })
          }}
          isStepGroup={data.stepConfig.isStepGroup}
        />
      )}
      {type === DrawerTypes.AddStep && selectedStageId && data?.paletteData && (
        <StepPalette
          onSelect={(item: StepData) => {
            const paletteData = data.paletteData
            if (paletteData?.entity) {
              const { stage: pipelineStage } = getStageFromPipeline(pipeline, selectedStageId)
              addStepOrGroup(
                paletteData.entity,
                pipelineStage?.stage.spec.execution,
                {
                  step: {
                    type: item.type,
                    name: item.label,
                    identifier: uuid(),
                    spec: {}
                  }
                },
                paletteData.isParallelNodeClicked,
                paletteData.isRollback
              )
              updatePipeline(pipeline)
            }
            updatePipelineView({ ...pipelineView, isDrawerOpened: false, drawerData: { type: DrawerTypes.AddStep } })
          }}
        />
      )}
      {/* TODO */}
      {type === DrawerTypes.PipelineVariables && <PipelineVariables />}
      {type === DrawerTypes.Templates && <PipelineTemplates />}
    </Drawer>
  )
}
