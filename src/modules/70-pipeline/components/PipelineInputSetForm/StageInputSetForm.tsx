import React from 'react'
import { Label } from '@wings-software/uikit'
import { StepViewType, StepWidget } from '@pipeline/exports'
import type {
  DeploymentStageConfig,
  K8SDirectInfrastructure,
  ServiceSpec,
  StepElement,
  ExecutionWrapper,
  ExecutionWrapperConfig
} from 'services/cd-ng'
import factory from '../PipelineSteps/PipelineStepFactory'
import { StepType } from '../PipelineSteps/PipelineStepInterface'

import { CollapseForm } from './CollapseForm'
import i18n from './PipelineInputSetForm.i18n'

function getStepFromStage(stepId: string, steps?: ExecutionWrapperConfig[]): ExecutionWrapperConfig | undefined {
  let responseStep: ExecutionWrapperConfig | undefined = undefined
  steps?.forEach(item => {
    if (item.step?.identifier === stepId) {
      responseStep = item
    } else if (item.stepGroup?.identifier === stepId) {
      responseStep = item
    } else if (item.parallel) {
      return ((item.parallel as unknown) as StepElement[]).forEach((node: ExecutionWrapper) => {
        if (node.step.identifier === stepId) {
          responseStep = node
        }
      })
    }
  })
  return responseStep
}

function StepForm({
  template,
  allValues,
  values,
  onUpdate
}: {
  template?: ExecutionWrapperConfig
  allValues?: ExecutionWrapperConfig
  values?: ExecutionWrapperConfig
  onUpdate: (data: ExecutionWrapper) => void
}): JSX.Element {
  return (
    <>
      <Label>{allValues?.step?.name}</Label>
      <StepWidget<ExecutionWrapper>
        factory={factory}
        template={template?.step}
        initialValues={values?.step || {}}
        allValues={allValues?.step || {}}
        type={allValues?.step?.type || ''}
        onUpdate={onUpdate}
        stepViewType={StepViewType.InputSet}
      />
    </>
  )
}
export interface StageInputSetFormProps {
  deploymentStage?: DeploymentStageConfig
  deploymentStageTemplate: DeploymentStageConfig
  deploymentStageInputSet?: DeploymentStageConfig
  onUpdate: (deploymentStage?: DeploymentStageConfig) => void
}

function ExecutionWrapperInputSetForm(props: {
  stepsTemplate: ExecutionWrapperConfig[]
  onUpdate: StageInputSetFormProps['onUpdate']
  deploymentStageInputSet: StageInputSetFormProps['deploymentStageInputSet']
  allValues?: ExecutionWrapperConfig[]
  values?: ExecutionWrapperConfig[]
}): JSX.Element {
  const { stepsTemplate, allValues, values, onUpdate, deploymentStageInputSet } = props
  return (
    <>
      {stepsTemplate?.map((item, index) => {
        if (item.step) {
          const originalStep = getStepFromStage(item.step?.identifier || '', allValues)
          const initialValues = getStepFromStage(item.step?.identifier || '', values)
          return originalStep && originalStep.step ? (
            <StepForm
              key={item.step.identifier || index}
              template={item}
              allValues={originalStep}
              values={initialValues}
              onUpdate={data => {
                if (initialValues) {
                  if (!initialValues.step) {
                    initialValues.step = { identifier: originalStep.step?.identifier || '' }
                  }
                  initialValues.step = { ...data, identifier: originalStep.step?.identifier || '' }
                  onUpdate(deploymentStageInputSet)
                }
              }}
            />
          ) : null
        } else if (item.parallel) {
          return ((item.parallel as unknown) as StepElement[]).map((nodep: ExecutionWrapper) => {
            if (nodep.step) {
              const originalStep = getStepFromStage(nodep.step?.identifier || '', allValues)
              const initialValues = getStepFromStage(nodep.step?.identifier || '', values)
              return originalStep && originalStep.step ? (
                <StepForm
                  key={nodep.step.identifier || index}
                  template={nodep}
                  allValues={originalStep}
                  values={initialValues}
                  onUpdate={data => {
                    if (initialValues) {
                      if (!initialValues.step) {
                        initialValues.step = { identifier: originalStep.step?.identifier || '' }
                      }
                      initialValues.step = { ...data, identifier: originalStep.step?.identifier || '' }
                      onUpdate(deploymentStageInputSet)
                    }
                  }}
                />
              ) : null
            }
          })
        } else if (item.stepGroup) {
          const stepGroup = getStepFromStage(item.stepGroup.identifier, allValues)
          const initialValues = getStepFromStage(item.stepGroup?.identifier || '', values)
          return (
            <>
              <CollapseForm
                header={stepGroup?.stepGroup?.name || ''}
                headerProps={{ font: { size: 'normal' } }}
                headerColor="var(--black)"
              >
                <ExecutionWrapperInputSetForm
                  stepsTemplate={item.stepGroup.steps}
                  onUpdate={onUpdate}
                  allValues={stepGroup?.stepGroup?.steps}
                  values={initialValues?.stepGroup?.steps}
                  deploymentStageInputSet={deploymentStageInputSet}
                />
              </CollapseForm>
              {item.stepGroup.rollbackSteps && (
                <CollapseForm
                  header={stepGroup?.stepGroup?.name + ' (Rollback)' || ''}
                  headerProps={{ font: { size: 'normal' } }}
                  headerColor="var(--black)"
                >
                  <ExecutionWrapperInputSetForm
                    stepsTemplate={item.stepGroup.rollbackSteps}
                    onUpdate={onUpdate}
                    allValues={stepGroup?.stepGroup?.rollbackSteps}
                    values={initialValues?.stepGroup?.rollbackSteps}
                    deploymentStageInputSet={deploymentStageInputSet}
                  />
                </CollapseForm>
              )}
            </>
          )
        }
      })}
    </>
  )
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
      {deploymentStageTemplate.execution?.steps && (
        <CollapseForm header={i18n.execution} headerProps={{ font: { size: 'normal' } }} headerColor="var(--black)">
          <ExecutionWrapperInputSetForm
            stepsTemplate={deploymentStageTemplate.execution.steps}
            onUpdate={onUpdate}
            allValues={deploymentStage?.execution?.steps}
            values={deploymentStageInputSet?.execution?.steps}
            deploymentStageInputSet={deploymentStageInputSet}
          />
        </CollapseForm>
      )}
      {deploymentStageTemplate.execution?.rollbackSteps && (
        <CollapseForm header={i18n.rollbackSteps} headerProps={{ font: { size: 'normal' } }} headerColor="var(--black)">
          <ExecutionWrapperInputSetForm
            stepsTemplate={deploymentStageTemplate.execution.rollbackSteps}
            onUpdate={onUpdate}
            allValues={deploymentStage?.execution?.rollbackSteps}
            values={deploymentStageInputSet?.execution?.rollbackSteps}
            deploymentStageInputSet={deploymentStageInputSet}
          />
        </CollapseForm>
      )}
    </>
  )
}
