import React from 'react'

import { NestedAccordionPanel } from '@wings-software/uicore'
import type { StageElement, NgPipeline, NGVariable as Variable } from 'services/cd-ng'
import { StepWidget } from '../../AbstractSteps/StepWidget'
import { StepViewType } from '../../AbstractSteps/Step'
import type { AbstractStepFactory } from '../../AbstractSteps/AbstractStepFactory'

export interface ServiceCardProps {
  stage: StageElement
  factory: AbstractStepFactory
  pipeline: NgPipeline
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
}

export function ServiceCard(props: ServiceCardProps): React.ReactElement {
  const { stage, factory, pipeline, updatePipeline } = props

  return (
    <div>
      <NestedAccordionPanel
        addDomId
        id={`Stage.${stage.identifier}.Service.Artifacts`}
        summary="Artifacts"
        details={<div />}
      />
      <NestedAccordionPanel
        addDomId
        id={`Stage.${stage.identifier}.Service.Manifests`}
        summary="Manifests"
        details={<div />}
      />
      <NestedAccordionPanel
        addDomId
        id={`Stage.${stage.identifier}.Service.Variables`}
        summary="Variables"
        details={
          <StepWidget<{ variables: Variable[] }>
            factory={factory}
            initialValues={{ variables: (pipeline as any).variables || [] }}
            type="Custom_Variable"
            stepViewType={StepViewType.InputVariable}
            onUpdate={({ variables }: { variables: Variable[] }) => {
              ;(pipeline as any).variables = variables
              updatePipeline(pipeline)
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
      addDomId
      id={`Stage.${props.stage.identifier}.Service`}
      summary="Service"
      details={<ServiceCard {...props} />}
    />
  )
}
