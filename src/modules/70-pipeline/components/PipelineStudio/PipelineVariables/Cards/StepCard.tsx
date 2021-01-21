import React from 'react'
import { NestedAccordionPanel } from '@wings-software/uicore'

import type { StepElementConfig } from 'services/cd-ng'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'

import type { PipelineVariablesData } from '../types'
import { VariableListTable } from './VariableListTable'

export interface StepCardProps {
  step: StepElementConfig
  originalStep: StepElementConfig
  stageIdentifier: string
  metadataMap: PipelineVariablesData['metadataMap']
  onUpdateStep(data: StepElementConfig): void
}

export function StepCard(props: StepCardProps): React.ReactElement {
  const { step, originalStep, metadataMap, stageIdentifier, onUpdateStep } = props
  const { stepsFactory } = usePipelineContext()

  return (
    <React.Fragment>
      <VariableListTable data={step} originalData={originalStep} metadataMap={metadataMap} />
      <StepWidget<StepElementConfig>
        factory={stepsFactory}
        initialValues={originalStep}
        type={originalStep.type as StepType}
        stepViewType={StepViewType.InputVariable}
        onUpdate={onUpdateStep}
        customStepProps={{
          stageIdentifier,
          metadataMap,
          variablesData: step
        }}
      />
    </React.Fragment>
  )
}

export function StepCardPanel(props: StepCardProps): React.ReactElement {
  return (
    <NestedAccordionPanel
      isDefaultOpen
      addDomId
      id={`Stage.${props.stageIdentifier}.Execution.Step.${props.originalStep.identifier}`}
      summary={props.originalStep.name}
      details={<StepCard {...props} />}
    />
  )
}
