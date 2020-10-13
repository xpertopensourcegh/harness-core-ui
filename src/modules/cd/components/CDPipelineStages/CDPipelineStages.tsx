import React from 'react'
import type { IconName } from '@wings-software/uikit'
import { PipelineStages, PipelineStagesProps } from 'modules/common/components/PipelineStages/PipelineStages'
import type { StagesMap } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { DeployStage } from './stages/DeployStage/DeployStage'
import i18n from './CDPipelineStages.i18n'
import { PipelineStage } from './stages/PipelineStage'

export enum CDStageTypes {
  DEPLOY = 'Deployment',
  PIPELINE = 'Pipeline',
  APPROVAL = 'Approval',
  CUSTOM = 'Custom'
}

export const MapStepTypeToIcon: { [key in CDStageTypes]: IconName } = {
  Deployment: 'pipeline-deploy',
  Approval: 'pipeline-approval',
  Pipeline: 'pipeline',
  Custom: 'pipeline-custom'
}

export const MapStepTypeToIconColor: { [key in CDStageTypes]: string } = {
  Deployment: 'var(--pipeline-deploy-stage-color)',
  Approval: 'var(--pipeline-approval-stage-color)',
  Pipeline: 'var(--pipeline-blue-color)',
  Custom: 'var(--pipeline-custom-stage-color)'
}

export const stagesMap: StagesMap = {
  [CDStageTypes.DEPLOY]: {
    name: i18n.deploy,
    type: CDStageTypes.DEPLOY,
    icon: MapStepTypeToIcon[CDStageTypes.DEPLOY],
    iconColor: MapStepTypeToIconColor[CDStageTypes.DEPLOY],
    isApproval: false
  },
  [CDStageTypes.PIPELINE]: {
    name: i18n.deploy,
    type: CDStageTypes.PIPELINE,
    icon: MapStepTypeToIcon[CDStageTypes.PIPELINE],
    iconColor: MapStepTypeToIconColor[CDStageTypes.PIPELINE],
    isApproval: false
  },
  [CDStageTypes.CUSTOM]: {
    name: i18n.deploy,
    type: CDStageTypes.CUSTOM,
    icon: MapStepTypeToIcon[CDStageTypes.CUSTOM],
    iconColor: MapStepTypeToIconColor[CDStageTypes.CUSTOM],
    isApproval: false
  },
  [CDStageTypes.APPROVAL]: {
    name: i18n.deploy,
    type: CDStageTypes.APPROVAL,
    icon: MapStepTypeToIcon[CDStageTypes.APPROVAL],
    iconColor: MapStepTypeToIconColor[CDStageTypes.APPROVAL],
    isApproval: false
  }
}

export const getCDPipelineStages: (
  args: Omit<PipelineStagesProps, 'children'>
) => React.ReactElement<PipelineStagesProps> = args => (
  <PipelineStages {...args}>
    <DeployStage
      icon={MapStepTypeToIcon[CDStageTypes.DEPLOY]}
      iconsStyle={{ color: 'var(--pipeline-deploy-stage-color)' }}
      name={i18n.deploy}
      type={CDStageTypes.DEPLOY}
      isDisabled={false}
      isApproval={false}
    />
    <PipelineStage
      icon={MapStepTypeToIcon[CDStageTypes.PIPELINE]}
      name={i18n.pipeline}
      type={CDStageTypes.PIPELINE}
      isDisabled={true}
      isApproval={false}
    />
    <PipelineStage
      icon={MapStepTypeToIcon[CDStageTypes.APPROVAL]}
      name={i18n.approval}
      type={CDStageTypes.APPROVAL}
      isDisabled={true}
      isApproval={true}
    />
    <PipelineStage
      icon={MapStepTypeToIcon[CDStageTypes.CUSTOM]}
      name={i18n.custom}
      type={CDStageTypes.CUSTOM}
      isDisabled={true}
      isApproval={false}
    />
  </PipelineStages>
)
