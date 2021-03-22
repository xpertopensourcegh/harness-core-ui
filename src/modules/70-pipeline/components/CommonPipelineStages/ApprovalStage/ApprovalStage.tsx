import React from 'react'
import { PipelineStage } from '@pipeline/exports'
import { ApprovalStageMinimalMode } from './ApprovalStageMinimalMode'
import { ApprovalStageSetupShellMode } from './ApprovalStageSetupShellMode'

export class ApprovalStage extends PipelineStage {
  render(): JSX.Element {
    const { minimal, stageProps } = this.props
    if (minimal) {
      return <ApprovalStageMinimalMode {...stageProps} />
    }
    return <ApprovalStageSetupShellMode />
  }
}
