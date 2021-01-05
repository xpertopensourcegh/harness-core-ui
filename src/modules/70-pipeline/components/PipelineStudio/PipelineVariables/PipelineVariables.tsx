import React from 'react'
import { Text, Card, Color } from '@wings-software/uicore'
import type { ITreeNode } from '@blueprintjs/core'
import type {
  StageElement,
  StageElementWrapper,
  DeploymentStage,
  NGVariable as Variable,
  NgPipeline
} from 'services/cd-ng'
import i18n from './PipelineVariables.i18n'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getPipelineTree } from '../PipelineUtils'
import { StepWidget } from '../../AbstractSteps/StepWidget'
import { StepViewType } from '../../AbstractSteps/Step'
import type { AbstractStepFactory } from '../../AbstractSteps/AbstractStepFactory'
import StagesTree, { stagesTreeNodeClasses } from '../../StagesThree/StagesTree'
import css from './PipelineVariables.module.scss'

function renderForStage(
  stage: StageElement,
  factory: AbstractStepFactory,
  pipeline: NgPipeline,
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
): JSX.Element {
  return (
    <Card className={css.variableCard} key={stage.identifier}>
      <Text color={Color.BLACK}>{i18n.stage}</Text>
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
        <StepWidget
          factory={factory}
          initialValues={{ variables: (stage.spec as DeploymentStage | any).customVariables || [] }}
          type={'Custom_Variable'}
          stepViewType={StepViewType.InputVariable}
          onUpdate={({ variables }: { variables: Variable[] }) => {
            ;(stage.spec as any).customVariables = variables
            updatePipeline(pipeline)
          }}
        />
      )}
    </Card>
  )
}

export const PipelineVariables: React.FC = (): JSX.Element => {
  const {
    state: { pipeline },
    updatePipeline,
    stepsFactory
  } = React.useContext(PipelineContext)

  const [nodes, updateNodes] = React.useState<ITreeNode[]>([])
  const [selectedTreeNodeId, setSelectedTreeNodeId] = React.useState<string>('Pipeline_Variables')

  React.useEffect(() => {
    updateNodes(getPipelineTree(pipeline, stagesTreeNodeClasses))
  }, [pipeline])

  const stagesCards: JSX.Element[] = []
  /* istanbul ignore else */ if (pipeline.stages && pipeline.stages?.length > 0) {
    pipeline.stages.forEach(data => {
      if (data.parallel && data.parallel.length > 0) {
        data.parallel.forEach((nodeP: StageElementWrapper) => {
          nodeP.stage && stagesCards.push(renderForStage(nodeP.stage, stepsFactory, pipeline, updatePipeline))
        })
      } /* istanbul ignore else */ else if (data.stage) {
        stagesCards.push(renderForStage(data.stage, stepsFactory, pipeline, updatePipeline))
      }
    })
  }

  return (
    <div className={css.pipelineVariables}>
      <div className={css.variablesContainer}>
        <div className={css.header}>
          <Text font={{ size: 'medium' }}>{i18n.variables}</Text>
        </div>
        <div className={css.content}>
          <StagesTree
            className={css.stagesTree}
            contents={nodes}
            selectedId={selectedTreeNodeId}
            selectionChange={id => setSelectedTreeNodeId(id)}
          />
          <div className={css.variableList}>
            <div className={css.variableListHeader}>
              <Text font={{ size: 'small' }}>{i18n.variables}</Text>
              <Text font={{ size: 'small' }}>{i18n.type}</Text>
              <Text font={{ size: 'small' }}>{i18n.values}</Text>
            </div>
            <Card className={css.variableCard}>
              <Text color={Color.BLACK}>{i18n.pipeline}</Text>
              <div className={css.variableListTable}>
                <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
                  $pipeline.name
                </Text>
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
                <Text style={{ paddingLeft: 'var(--spacing-large)', paddingTop: 'var(--spacing-large)' }}>
                  $pipeline.tags
                </Text>
                <Text>{i18n.string}</Text>
                <Text>{pipeline.tags}</Text>
              </div>

              <StepWidget<{ variables: Variable[] }>
                factory={stepsFactory}
                initialValues={{ variables: (pipeline as any).variables || [] }}
                type={'Custom_Variable'}
                stepViewType={StepViewType.InputVariable}
                onUpdate={({ variables }: { variables: Variable[] }) => {
                  ;(pipeline as any).variables = variables
                  updatePipeline(pipeline)
                }}
              />
            </Card>
            {stagesCards}
          </div>
        </div>
      </div>
    </div>
  )
}
