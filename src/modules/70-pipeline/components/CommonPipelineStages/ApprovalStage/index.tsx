import React from 'react'
import type { UseStringsReturn } from 'framework/exports'
import { StageTypes } from '@pipeline/components/PipelineStudio/Stages/StageTypes'
import { stagesCollection } from '@pipeline/components/PipelineStudio/Stages/StagesCollection'
import type { StageAttributes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { ApprovalStage } from './ApprovalStage'

const getStageAttributes = (_getString: UseStringsReturn['getString']): StageAttributes => ({
  name: 'Approval',
  type: StageTypes.APPROVAL,
  icon: 'pipeline-approval',
  iconColor: 'var(--pipeline-approval-stage-color)',
  isApproval: true,
  openExecutionStrategy: false
})

const getStageEditorImplementation = (isEnabled: boolean, _getString: UseStringsReturn['getString']) => (
  <ApprovalStage
    icon={'pipeline-approval'}
    name={'Approval'}
    title={_getString('approvalStage.title')}
    description={_getString('approvalStage.description')}
    type={StageTypes.APPROVAL}
    isDisabled={!isEnabled}
    isApproval={true}
  />
)

stagesCollection.registerStageFactory(StageTypes.APPROVAL, getStageAttributes, getStageEditorImplementation)
