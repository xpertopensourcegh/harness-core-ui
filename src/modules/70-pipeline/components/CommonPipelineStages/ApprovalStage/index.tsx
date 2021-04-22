import React from 'react'
import type { UseStringsReturn } from 'framework/strings'
import { StageTypes } from '@pipeline/components/PipelineStudio/Stages/StageTypes'
import { stagesCollection } from '@pipeline/components/PipelineStudio/Stages/StagesCollection'
import type { StageAttributes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import type { PipelineStageProps } from '@pipeline/components/PipelineStages/PipelineStage'
import { ApprovalStage } from './ApprovalStage'

const getStageAttributes = (_getString: UseStringsReturn['getString']): StageAttributes => ({
  name: 'Approval',
  type: StageTypes.APPROVAL,
  icon: 'pipeline-approval',
  iconColor: 'var(--pipeline-approval-stage-color)',
  isApproval: true,
  openExecutionStrategy: false
})

const getStageEditorImplementation = (
  isEnabled: boolean,
  _getString: UseStringsReturn['getString']
): React.ReactElement<PipelineStageProps> => (
  <ApprovalStage
    icon={'pipeline-approval'}
    name={'Approval'}
    title={_getString('approvalStage.title')}
    description={_getString('approvalStage.description')}
    type={StageTypes.APPROVAL}
    iconsStyle={{ color: 'var(--pipeline-approval-stage-color)' }}
    isDisabled={!isEnabled}
    isApproval={true}
  />
)

stagesCollection.registerStageFactory(StageTypes.APPROVAL, getStageAttributes, getStageEditorImplementation)
