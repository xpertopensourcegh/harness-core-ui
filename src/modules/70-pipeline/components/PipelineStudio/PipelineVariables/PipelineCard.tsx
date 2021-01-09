import React from 'react'

import { Text, Card } from '@wings-software/uicore'

import type { NGVariable as Variable, NgPipeline } from 'services/cd-ng'
import { StepWidget } from '../../AbstractSteps/StepWidget'
import { StepViewType } from '../../AbstractSteps/Step'
import type { AbstractStepFactory } from '../../AbstractSteps/AbstractStepFactory'
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
    <Card className={css.variableCard}>
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

      <StepWidget<{ variables: Variable[] }>
        factory={stepsFactory}
        initialValues={{ variables: (pipeline as any).variables || [] }}
        type="Custom_Variable"
        stepViewType={StepViewType.InputVariable}
        onUpdate={({ variables }: { variables: Variable[] }) => {
          ;(pipeline as any).variables = variables
          updatePipeline(pipeline)
        }}
      />
    </Card>
  )
}
