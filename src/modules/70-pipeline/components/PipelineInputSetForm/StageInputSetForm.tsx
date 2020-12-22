import React from 'react'
import { Label } from '@wings-software/uikit'
import { connect } from 'formik'
import { get, set } from 'lodash-es'
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
import { getStepFromStage } from '../AbstractSteps/StepUtil'

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
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik?: any
}

function ExecutionWrapperInputSetForm(props: {
  stepsTemplate: ExecutionWrapperConfig[]
  formik: StageInputSetFormProps['formik']
  path: string
  allValues?: ExecutionWrapperConfig[]
  values?: ExecutionWrapperConfig[]
}): JSX.Element {
  const { stepsTemplate, allValues, values, path, formik } = props
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
                  formik?.setValues(set(formik?.values, `${path}[${index}].step`, initialValues.step))
                }
              }}
            />
          ) : null
        } else if (item.parallel) {
          return ((item.parallel as unknown) as StepElement[]).map((nodep: ExecutionWrapper, indexp) => {
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
                      formik?.setValues(
                        set(formik?.values, `${path}[${index}].parallel[${indexp}].step`, initialValues.step)
                      )
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
                  formik={formik}
                  path={`${path}[${index}].stepGroup.steps`}
                  allValues={stepGroup?.stepGroup?.steps}
                  values={initialValues?.stepGroup?.steps}
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
                    formik={formik}
                    path={`${path}[${index}].stepGroup.rollbackSteps`}
                    allValues={stepGroup?.stepGroup?.rollbackSteps}
                    values={initialValues?.stepGroup?.rollbackSteps}
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

export const StageInputSetFormInternal: React.FC<StageInputSetFormProps> = ({
  deploymentStageTemplate,
  deploymentStage,
  path,
  formik
}) => {
  const deploymentStageInputSet = get(formik?.values, path, {})
  return (
    <>
      {deploymentStageTemplate.service?.serviceDefinition?.type === 'Kubernetes' && (
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
                formik?.setValues(set(formik?.values, path, deploymentStageInputSet))
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
              type={deploymentStage?.infrastructure?.infrastructureDefinition?.type || StepType.KubernetesDirect}
              path={`${path}.infrastructure.infrastructureDefinition.spec`}
              onUpdate={data => {
                if (deploymentStageInputSet?.infrastructure?.infrastructureDefinition?.spec) {
                  deploymentStageInputSet.infrastructure.infrastructureDefinition.spec = data
                  formik?.setValues(set(formik?.values, path, deploymentStageInputSet))
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
            path={`${path}.execution.steps`}
            allValues={deploymentStage?.execution?.steps}
            values={deploymentStageInputSet?.execution?.steps}
            formik={formik}
          />
        </CollapseForm>
      )}
      {deploymentStageTemplate.execution?.rollbackSteps && (
        <CollapseForm header={i18n.rollbackSteps} headerProps={{ font: { size: 'normal' } }} headerColor="var(--black)">
          <ExecutionWrapperInputSetForm
            stepsTemplate={deploymentStageTemplate.execution.rollbackSteps}
            path={`${path}.execution.rollbackSteps`}
            allValues={deploymentStage?.execution?.rollbackSteps}
            values={deploymentStageInputSet?.execution?.rollbackSteps}
            formik={formik}
          />
        </CollapseForm>
      )}
    </>
  )
}
export const StageInputSetForm = connect(StageInputSetFormInternal)
