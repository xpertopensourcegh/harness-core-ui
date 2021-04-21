import React from 'react'
import type { UseStringsReturn } from 'framework/strings'
import { StageTypes } from '@pipeline/components/PipelineStudio/Stages/StageTypes'
import { stagesCollection } from '@pipeline/components/PipelineStudio/Stages/StagesCollection'
import type { StageAttributes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { CustomStage } from './CustomStage'

const getStageAttributes = (_getString: UseStringsReturn['getString']): StageAttributes => ({
  name: 'Custom',
  type: StageTypes.CUSTOM,
  icon: 'pipeline-custom',
  iconColor: 'var(--pipeline-custom-stage-color)',
  isApproval: false,
  openExecutionStrategy: false
})

const getStageEditorImplementation = (isEnabled: boolean, _getString: UseStringsReturn['getString']) => (
  <CustomStage
    icon={'pipeline-custom'}
    name={'Custom'}
    title=""
    description=""
    type={StageTypes.CUSTOM}
    isDisabled={!isEnabled}
    isApproval={false}
  />
)

stagesCollection.registerStageFactory(StageTypes.CUSTOM, getStageAttributes, getStageEditorImplementation)
