import React from 'react'

import { Text, Color, NestedAccordionPanel } from '@wings-software/uicore'
import type { StageElement } from 'services/cd-ng'

import type {
  CustomVariablesData,
  CustomVariableEditableExtraProps
} from '@pipeline/components/PipelineSteps/Steps/CustomVariables/CustomVariableEditable'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { usePipelineContext } from '../PipelineContext/PipelineContext'

import { ServiceCardPanel } from './ServiceCard'
import i18n from './PipelineVariables.i18n'
import css from './PipelineVariables.module.scss'

export interface StageCardProps {
  stage: StageElement
}

export default function StageCard(props: StageCardProps): React.ReactElement {
  const { stage } = props
  const { updateStage, stepsFactory } = usePipelineContext()

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
            >{`$${stage.identifier}.name`}</Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.name}</Text>
            <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
              {`$${stage.identifier}.identifier`}
            </Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.identifier}</Text>
            <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
              {`$${stage.identifier}.description`}
            </Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.description}</Text>
            <Text
              style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}
            >{`$${stage.identifier}.tags`}</Text>
            <Text>{i18n.string}</Text>
            <Text>{stage.tags}</Text>
          </div>

          {stage.spec && (
            <React.Fragment>
              <StepWidget<CustomVariablesData, CustomVariableEditableExtraProps>
                factory={stepsFactory}
                initialValues={{
                  variables: (stage as any).variables || [],
                  canAddVariable: true
                }}
                type={StepType.CustomVariable}
                stepViewType={StepViewType.InputVariable}
                onUpdate={({ variables }: CustomVariablesData) => {
                  updateStage({ ...stage, variables } as any)
                }}
                customStepProps={{
                  variableNamePrefix: `$${stage.identifier}.`,
                  domId: `Stage.${stage.identifier}.Variables-panel`
                }}
              />
              {/* TODO: Temporary disable for  CI (TBD)*/}
              {stage.type === 'Deployment' ? (
                <>
                  <ServiceCardPanel stage={stage} />
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
                </>
              ) : null}
            </React.Fragment>
          )}
        </div>
      }
    />
  )
}
