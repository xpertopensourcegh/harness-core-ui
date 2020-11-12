import React from 'react'
import { PipelineStage } from '@pipeline/exports'
import type { StageElementWrapper } from 'services/cd-ng'
import { EditStageView } from '@cd/components/CDPipelineStages/stages/DeployStage/EditStageView/EditStageView'
import DeployStageSetupShell from '../../../DeployStageSetupShell/DeployStageSetupShell'

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
    return <DeployStageSetupShell />
  }
}
