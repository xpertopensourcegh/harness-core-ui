import React from 'react'

import { Text, Color, NestedAccordionPanel } from '@wings-software/uicore'
import type { StageElement, DeploymentStage, NGVariable as Variable, NgPipeline } from 'services/cd-ng'

import { StepWidget } from '../../AbstractSteps/StepWidget'
import { StepViewType } from '../../AbstractSteps/Step'
import type { AbstractStepFactory } from '../../AbstractSteps/AbstractStepFactory'
import { ServiceCardPanel } from './ServiceCard'
import i18n from './PipelineVariables.i18n'
import css from './PipelineVariables.module.scss'

export interface StageCardProps {
  stage: StageElement
  factory: AbstractStepFactory
  pipeline: NgPipeline
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
}

export default function StageCard(props: StageCardProps): React.ReactElement {
  const { stage, factory, pipeline, updatePipeline } = props

  return (
    <NestedAccordionPanel
      key={stage.identifier}
      id={`Stage.${stage.identifier}`}
      addDomId
      summary={
        <Text className={css.stageTitle} color={Color.BLACK}>
          {stage.name}
        </Text>
      }
      details={
        <div className={css.variableCard}>
          <div className={css.variableListTable}>
            <Text
              style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}
            >{`${stage.identifier}.name`}</Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.name}</Text>
            <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
              {`${stage.identifier}.identifier`}
            </Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.identifier}</Text>
            <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
              {`${stage.identifier}.description`}
            </Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.description}</Text>
            <Text
              style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}
            >{`${stage.identifier}.tags`}</Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.tags}</Text>
          </div>

          {stage.spec && (
            <React.Fragment>
              <StepWidget
                factory={factory}
                initialValues={{
                  // TODO: fix this later with correct path
                  variables: (stage.spec as DeploymentStage | any).customVariables || []
                }}
                type="Custom_Variable"
                stepViewType={StepViewType.InputVariable}
                onUpdate={({ variables }: { variables: Variable[] }) => {
                  // TODO: fix this later with correct path
                  ;(stage.spec as any).customVariables = variables
                  updatePipeline(pipeline)
                }}
              />
              <ServiceCardPanel stage={stage} pipeline={pipeline} factory={factory} updatePipeline={updatePipeline} />
              <NestedAccordionPanel
                addDomId
                id={`Stage.${stage.identifier}.Infrastructure`}
                summary="InfraStructure"
                details={<div />}
              />
              <NestedAccordionPanel
                addDomId
                id={`Stage.${stage.identifier}.Execution`}
                summary="Execution"
                details={<div />}
              />
            </React.Fragment>
          )}
        </div>
      }
    />
  )
}
