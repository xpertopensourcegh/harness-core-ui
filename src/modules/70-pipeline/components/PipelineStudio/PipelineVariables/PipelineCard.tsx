import React from 'react'

import { Text, Card } from '@wings-software/uicore'

import type { NgPipeline } from 'services/cd-ng'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import type {
  CustomVariablesData,
  CustomVariableEditableExtraProps
} from '@pipeline/components/PipelineSteps/Steps/CustomVariables/CustomVariableEditable'

import i18n from './PipelineVariables.i18n'
import css from './PipelineVariables.module.scss'

export interface PipelineCardProps {
  pipeline: NgPipeline
  stepsFactory: AbstractStepFactory
  updatePipeline(pipeline: NgPipeline): void
}

export default function PipelineCard(props: PipelineCardProps): React.ReactElement {
  const { pipeline, stepsFactory, updatePipeline } = props

  return (
    <Card className={css.variableCard} id="Pipeline-panel">
      <div className={css.variableListTable}>
        <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>$pipeline.name</Text>
        <Text>{i18n.string}</Text>
        <Text>{pipeline.name}</Text>
        <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
          $pipeline.identifier
        </Text>
        <Text>{i18n.string}</Text>
        <Text>{pipeline.identifier}</Text>
        <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
          $pipeline.description
        </Text>
        <Text>{i18n.string}</Text>
        <Text>{pipeline.description}</Text>
        <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>$pipeline.tags</Text>
        <Text>{i18n.string}</Text>
        <Text>{pipeline.tags}</Text>
      </div>

      <StepWidget<CustomVariablesData, CustomVariableEditableExtraProps>
        factory={stepsFactory}
        initialValues={{ variables: (pipeline as any).variables || [], canAddVariable: true }}
        type={StepType.CustomVariable}
        stepViewType={StepViewType.InputVariable}
        onUpdate={({ variables }: CustomVariablesData) => {
          updatePipeline({
            ...pipeline,
            variables: variables as any
          })
        }}
        customStepProps={{ variableNamePrefix: '$pipeline.', domId: 'Pipeline.Variables-panel' }}
      />
    </Card>
  )
}
