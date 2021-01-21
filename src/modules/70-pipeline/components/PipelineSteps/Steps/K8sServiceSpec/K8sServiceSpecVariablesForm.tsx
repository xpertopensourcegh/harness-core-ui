import React from 'react'
import { NestedAccordionPanel } from '@wings-software/uicore'

import type { ServiceSpec } from 'services/cd-ng'
import type { VariableMergeServiceResponse } from 'services/pipeline-ng'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'

import type { CustomVariablesData, CustomVariableEditableExtraProps } from '../CustomVariables/CustomVariableEditable'

export interface K8sServiceSpecVariablesFormProps {
  initialValues: ServiceSpec
  stepsFactory: AbstractStepFactory
  stageIdentifier: string
  onUpdate?(data: ServiceSpec): void
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
  variablesData: ServiceSpec
}

export function K8sServiceSpecVariablesForm(props: K8sServiceSpecVariablesFormProps): React.ReactElement {
  const { initialValues, stepsFactory, stageIdentifier, onUpdate, variablesData, metadataMap } = props
  const { manifests, artifacts, variables } = initialValues

  return (
    <React.Fragment>
      {artifacts ? (
        <NestedAccordionPanel
          isDefaultOpen
          addDomId
          id={`Stage.${stageIdentifier}.Service.Artifacts`}
          summary="Artifacts"
          details={<div />}
        />
      ) : null}
      {manifests ? (
        <NestedAccordionPanel
          isDefaultOpen
          addDomId
          id={`Stage.${stageIdentifier}.Service.Manifests`}
          summary="Manifests"
          details={<div />}
        />
      ) : null}
      <NestedAccordionPanel
        isDefaultOpen
        addDomId
        id={`Stage.${stageIdentifier}.Service.Variables`}
        summary="Variables"
        details={
          <StepWidget<CustomVariablesData, CustomVariableEditableExtraProps>
            factory={stepsFactory}
            initialValues={{
              variables: variables || [],
              canAddVariable: true
            }}
            type={StepType.CustomVariable}
            stepViewType={StepViewType.InputVariable}
            onUpdate={onUpdate}
            customStepProps={{
              variableNamePrefix: 'serviceConfig.variables.',
              yamlProperties: variablesData?.variables?.map(
                variable => metadataMap?.[variable.value || '']?.yamlProperties || {}
              )
            }}
          />
        }
      />
    </React.Fragment>
  )
}
