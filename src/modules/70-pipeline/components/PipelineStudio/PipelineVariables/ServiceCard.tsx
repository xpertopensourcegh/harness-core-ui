import React from 'react'

import { NestedAccordionPanel } from '@wings-software/uicore'
import type { StageElement } from 'services/cd-ng'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { CustomVariablesData } from '@pipeline/components/PipelineSteps/Steps/CustomVariables/CustomVariableEditable'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { usePipelineContext } from '../PipelineContext/PipelineContext'

export interface ServiceCardProps {
  stage: StageElement
}

export function ServiceCard(props: ServiceCardProps): React.ReactElement {
  const { stage } = props
  const { updateStage, stepsFactory } = usePipelineContext()

  return (
    <div>
      <NestedAccordionPanel
        isDefaultOpen
        addDomId
        id={`Stage.${stage.identifier}.Service.Artifacts`}
        summary="Artifacts"
        details={<div />}
      />
      <NestedAccordionPanel
        isDefaultOpen
        addDomId
        id={`Stage.${stage.identifier}.Service.Manifests`}
        summary="Manifests"
        details={<div />}
      />
      <NestedAccordionPanel
        isDefaultOpen
        addDomId
        id={`Stage.${stage.identifier}.Service.Variables`}
        summary="Variables"
        details={
          <StepWidget<CustomVariablesData>
            factory={stepsFactory}
            initialValues={{ variables: (stage as any).service?.serviceSpec?.variables || [], canAddVariable: true }}
            type={StepType.CustomVariable}
            stepViewType={StepViewType.InputVariable}
            onUpdate={({ variables }: CustomVariablesData) => {
              updateStage({
                ...stage,
                service: {
                  ...stage.service,
                  serviceSpec: {
                    ...stage.service.serviceSpec,
                    variables
                  }
                }
              } as any)
            }}
          />
        }
      />
    </div>
  )
}

export function ServiceCardPanel(props: ServiceCardProps): React.ReactElement {
  return (
    <NestedAccordionPanel
      isDefaultOpen
      addDomId
      id={`Stage.${props.stage.identifier}.Service`}
      summary="Service"
      details={<ServiceCard {...props} />}
    />
  )
}
