import React from 'react'
import type { UseStringsReturn } from 'framework/strings/String'
import { StageTypes } from '@pipeline/components/PipelineStudio/Stages/StageTypes'
import { stagesCollection } from '@pipeline/components/PipelineStudio/Stages/StagesCollection'
import type { StageAttributes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { PipelineStage } from './PipelineStage'

const getStageAttributes = (_getString: UseStringsReturn['getString']): StageAttributes => ({
  name: 'Pipeline',
  type: StageTypes.PIPELINE,
  icon: 'pipeline',
  iconColor: 'var(--pipeline-blue-color)',
  isApproval: false,
  openExecutionStrategy: false
})

const getStageEditorImplementation = (isEnabled: boolean, _getString: UseStringsReturn['getString']) => (
  <PipelineStage
    icon={'pipeline'}
    name={'Pipeline'}
    title=""
    description=""
    type={StageTypes.PIPELINE}
    isDisabled={!isEnabled}
    isApproval={false}
  />
)

stagesCollection.registerStageFactory(StageTypes.PIPELINE, getStageAttributes, getStageEditorImplementation)
