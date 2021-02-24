import React from 'react'
import type { IconName } from '@wings-software/uicore'
import { PipelineStages, PipelineStagesProps } from '@pipeline/exports'
import type { StagesMap } from '@pipeline/exports'
import { BuildStage } from '@cd/components/CDPipelineStages/stages/BuildStage/BuildStage'
import type { UseStringsReturn } from 'framework/exports'
import { DeployStage } from './stages/DeployStage/DeployStage'
import i18n from './CDPipelineStages.i18n'
import { PipelineStage } from './stages/PipelineStage'
import { CustomStage } from './stages/CustomStage'
import { ApprovalStage } from './stages/ApprovalStage'

export enum StageTypes {
  DEPLOY = 'Deployment',
  BUILD = 'CI',
  PIPELINE = 'Pipeline',
  APPROVAL = 'Approval',
  CUSTOM = 'Custom'
}

export const MapStepTypeToIcon: { [key in StageTypes]: IconName } = {
  Deployment: 'cd-main',
  CI: 'ci-main',
  Approval: 'pipeline-approval',
  Pipeline: 'pipeline',
  Custom: 'pipeline-custom'
}

export const MapStepTypeToIconColor: { [key in StageTypes]: string } = {
  Deployment: 'var(--pipeline-deploy-stage-color)',
  CI: 'var(--pipeline-build-stage-color)',
  Approval: 'var(--pipeline-approval-stage-color)',
  Pipeline: 'var(--pipeline-blue-color)',
  Custom: 'var(--pipeline-custom-stage-color)'
}

export const stagesMap: StagesMap = {
  [StageTypes.DEPLOY]: {
    name: i18n.deploy,
    type: StageTypes.DEPLOY,
    icon: MapStepTypeToIcon[StageTypes.DEPLOY],
    iconColor: MapStepTypeToIconColor[StageTypes.DEPLOY],
    isApproval: false,
    openExecutionStrategy: true
  },
  [StageTypes.BUILD]: {
    name: i18n.deploy,
    type: StageTypes.BUILD,
    icon: MapStepTypeToIcon[StageTypes.BUILD],
    iconColor: MapStepTypeToIconColor[StageTypes.BUILD],
    isApproval: false,
    openExecutionStrategy: false
  },
  [StageTypes.PIPELINE]: {
    name: i18n.deploy,
    type: StageTypes.PIPELINE,
    icon: MapStepTypeToIcon[StageTypes.PIPELINE],
    iconColor: MapStepTypeToIconColor[StageTypes.PIPELINE],
    isApproval: false,
    openExecutionStrategy: false
  },
  [StageTypes.CUSTOM]: {
    name: i18n.deploy,
    type: StageTypes.CUSTOM,
    icon: MapStepTypeToIcon[StageTypes.CUSTOM],
    iconColor: MapStepTypeToIconColor[StageTypes.CUSTOM],
    isApproval: false,
    openExecutionStrategy: false
  },
  [StageTypes.APPROVAL]: {
    name: i18n.deploy,
    type: StageTypes.APPROVAL,
    icon: MapStepTypeToIcon[StageTypes.APPROVAL],
    iconColor: MapStepTypeToIconColor[StageTypes.APPROVAL],
    isApproval: false,
    openExecutionStrategy: false
  }
}

export const getCDPipelineStages: (
  args: Omit<PipelineStagesProps, 'children'>,
  getString: UseStringsReturn['getString'],
  isCIEnabled?: boolean,
  isCDEnabled?: boolean
) => React.ReactElement<PipelineStagesProps> = (args, getString, isCIEnabled = false, isCDEnabled = false) => {
  return (
    <PipelineStages {...args}>
      <DeployStage
        icon={MapStepTypeToIcon[StageTypes.DEPLOY]}
        iconsStyle={{ color: 'var(--pipeline-deploy-stage-color)' }}
        name={i18n.deploy}
        type={StageTypes.DEPLOY}
        title={getString('pipelineSteps.deploy.create.deployStageName')}
        description={getString('pipelineSteps.deploy.create.deployStageDescription')}
        isHidden={!isCDEnabled}
        isDisabled={false}
        isApproval={false}
      />
      <BuildStage
        icon={MapStepTypeToIcon[StageTypes.BUILD]}
        iconsStyle={{ color: 'var(--pipeline-build-stage-color)' }}
        name={i18n.build}
        type={StageTypes.BUILD}
        title={getString('pipelineSteps.build.create.buildStageName')}
        description={getString('pipelineSteps.build.create.buildStageDescription')}
        isDisabled={false}
        isHidden={!isCIEnabled}
        isApproval={false}
      />
      <PipelineStage
        icon={MapStepTypeToIcon[StageTypes.PIPELINE]}
        name={i18n.pipeline}
        title=""
        description=""
        type={StageTypes.PIPELINE}
        isDisabled={true}
        isApproval={false}
      />
      <ApprovalStage
        icon={MapStepTypeToIcon[StageTypes.APPROVAL]}
        name={i18n.approval}
        title=""
        description=""
        type={StageTypes.APPROVAL}
        isDisabled={true}
        isApproval={true}
      />
      <CustomStage
        icon={MapStepTypeToIcon[StageTypes.CUSTOM]}
        name={i18n.custom}
        title=""
        description=""
        type={StageTypes.CUSTOM}
        isDisabled={true}
        isApproval={false}
      />
    </PipelineStages>
  )
}
