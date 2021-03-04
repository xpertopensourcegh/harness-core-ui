import React from 'react'
import { PipelineStage } from '@pipeline/exports'
import type { StageElementWrapper } from 'services/cd-ng'
import { FeatureAddEditStageView } from './FeatureAddStageView/FeatureAddStageView'
import FeatureStageSetupShell from '../FeatureStageSetupShell/FeatureStageSetupShell'

interface DeployStageProps {
  data?: StageElementWrapper
  onSubmit?: (values: StageElementWrapper, identifier: string) => void
}

export class FeatureFlagStage extends PipelineStage<DeployStageProps> {
  render(): JSX.Element {
    const { minimal, stageProps } = this.props
    if (minimal) {
      return <FeatureAddEditStageView {...stageProps} />
    }
    return <FeatureStageSetupShell />
  }
}
