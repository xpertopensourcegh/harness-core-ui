import React from 'react'
import type { UseStringsReturn } from 'framework/strings'
import { StageTypes } from '@pipeline/components/PipelineStudio/Stages/StageTypes'
import { stagesCollection } from '@pipeline/components/PipelineStudio/Stages/StagesCollection'
import type { StageAttributes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { FeatureFlagStage } from './FeatureFlagStage'

const getStageAttributes = (getString: UseStringsReturn['getString']): StageAttributes => ({
  name: getString('pipelineSteps.feature.create.featureStageName'),
  type: StageTypes.FEATURE,
  icon: 'cf-main',
  iconColor: 'var(--pipeline-feature-stage-color)',
  isApproval: false,
  openExecutionStrategy: false
})

const getStageEditorImplementation = (isEnabled: boolean, getString: UseStringsReturn['getString']) => (
  <FeatureFlagStage
    icon={'cf-main'}
    iconsStyle={{ color: 'var(--pipeline-feature-stage-color)' }}
    name={getString('pipelineSteps.feature.create.featureStageName')}
    type={StageTypes.FEATURE}
    title={getString('pipelineSteps.feature.create.featureStageName')}
    description={getString('pipelineSteps.feature.create.featureStageDescription')}
    isDisabled={false}
    isHidden={!isEnabled}
    isApproval={false}
  />
)

stagesCollection.registerStageFactory(StageTypes.FEATURE, getStageAttributes, getStageEditorImplementation)
