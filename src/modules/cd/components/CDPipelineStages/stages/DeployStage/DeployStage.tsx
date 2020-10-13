import React from 'react'
import { PipelineStage } from 'modules/common/components/PipelineStages/PipelineStage'
import type { StageElementWrapper } from 'services/cd-ng'
import { EditStageView } from 'modules/cd/components/CDPipelineStages/stages/DeployStage/EditStageView/EditStageView'
import StageSetupShell from '../../../StageSetupShell/StageSetupShell'

interface DeployStageProps {
  data?: StageElementWrapper
  onSubmit?: (values: StageElementWrapper, identifier: string) => void
}

export class DeployStage extends PipelineStage<DeployStageProps> {
  render(): JSX.Element {
    const { minimal, stageProps } = this.props
    if (minimal) {
      return <EditStageView {...stageProps} />
    }
    return <StageSetupShell />
  }
}
