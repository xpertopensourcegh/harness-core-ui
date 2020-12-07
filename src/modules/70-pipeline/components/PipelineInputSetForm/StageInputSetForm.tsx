import React from 'react'
import { StepViewType, StepWidget } from '@pipeline/exports'
import type { DeploymentStage, K8SDirectInfrastructure, ServiceSpec } from 'services/cd-ng'
import factory from '../PipelineSteps/PipelineStepFactory'
import { StepType } from '../PipelineSteps/PipelineStepInterface'

import { CollapseForm } from './CollapseForm'
import i18n from './PipelineInputSetForm.i18n'
export interface StageInputSetFormProps {
  deploymentStage?: DeploymentStage
  deploymentStageTemplate: DeploymentStage
  deploymentStageInputSet?: DeploymentStage
  onUpdate: (deploymentStage?: DeploymentStage) => void
}

export const StageInputSetForm: React.FC<StageInputSetFormProps> = ({
  deploymentStageTemplate,
  deploymentStage,
  deploymentStageInputSet,
  onUpdate
}) => {
  return (
    <>
      {deploymentStageTemplate.service && (
        <CollapseForm
          header={i18n.service(deploymentStage?.service?.name || '')}
          headerProps={{ font: { size: 'normal' } }}
          headerColor="var(--black)"
          open={false}
        >
          <StepWidget<ServiceSpec>
            factory={factory}
            initialValues={deploymentStageInputSet?.service?.serviceDefinition?.spec || {}}
            template={deploymentStageTemplate?.service?.serviceDefinition?.spec || {}}
            type={StepType.K8sServiceSpec}
            stepViewType={StepViewType.InputSet}
            onUpdate={(data: any) => {
              if (deploymentStageInputSet?.service?.serviceDefinition?.spec) {
                deploymentStageInputSet.service.serviceDefinition.spec = data
                onUpdate(deploymentStageInputSet)
              }
            }}
          />
        </CollapseForm>
      )}
      {deploymentStageTemplate.infrastructure && (
        <CollapseForm
          header={i18n.infrastructure}
          headerProps={{ font: { size: 'normal' } }}
          headerColor="var(--black)"
        >
          {deploymentStageTemplate.infrastructure.infrastructureDefinition && (
            <StepWidget<K8SDirectInfrastructure>
              factory={factory}
              template={deploymentStageTemplate.infrastructure.infrastructureDefinition.spec}
              initialValues={deploymentStageInputSet?.infrastructure?.infrastructureDefinition?.spec || {}}
              allValues={deploymentStage?.infrastructure?.infrastructureDefinition?.spec || {}}
              type={StepType.KubernetesInfraSpec}
              onUpdate={data => {
                if (deploymentStageInputSet?.infrastructure?.infrastructureDefinition?.spec) {
                  deploymentStageInputSet.infrastructure.infrastructureDefinition.spec = data
                  onUpdate(deploymentStageInputSet)
                }
              }}
              stepViewType={StepViewType.InputSet}
            />
          )}
        </CollapseForm>
      )}
      {deploymentStageTemplate.variables && (
        <CollapseForm
          header={i18n.stageVariables}
          headerProps={{ font: { size: 'normal' } }}
          headerColor="var(--black)"
        >
          <div>WIP</div>
        </CollapseForm>
      )}
      {deploymentStageTemplate.execution && (
        <CollapseForm header={i18n.execution} headerProps={{ font: { size: 'normal' } }} headerColor="var(--black)">
          <div>WIP</div>
        </CollapseForm>
      )}
    </>
  )
}
