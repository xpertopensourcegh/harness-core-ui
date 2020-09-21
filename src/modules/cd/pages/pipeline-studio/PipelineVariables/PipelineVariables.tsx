import React from 'react'
import { cloneDeep } from 'lodash-es'
import { Text, Card, Color } from '@wings-software/uikit'
import { Tree, ITreeNode } from '@blueprintjs/core'
import type { StageElement, StageElementWrapper, DeploymentStage, Variable } from 'services/cd-ng'
import { StepWidget, StepViewType } from 'modules/common/exports'
import { StepType } from '../../../components/PipelineSteps/PipelineStepInterface'
import factory from '../../../components/PipelineSteps/PipelineStepFactory'
import { RightBar } from '../RightBar/RightBar'
import i18n from './PipelineVariables.i18n'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getPipelineTree } from '../PipelineUtils'
import css from './PipelineVariables.module.scss'

function forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void): void {
  for (const node of nodes) {
    callback(node)
    if (node.childNodes) {
      forEachNode(node.childNodes, callback)
    }
  }
}

function renderForStage(stage: StageElement): JSX.Element {
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
          initialValues={{ variables: (stage.spec as DeploymentStage).stageVariables || [] }}
          type={StepType.CustomVariable}
          stepViewType={StepViewType.InputVariable}
        />
      )}
    </Card>
  )
}

export const PipelineVariables: React.FC = (): JSX.Element => {
  const {
    state: { pipeline },
    updatePipeline
  } = React.useContext(PipelineContext)

  const [nodes, updateNodes] = React.useState<ITreeNode[]>([])

  React.useEffect(() => {
    updateNodes(getPipelineTree(pipeline))
  }, [pipeline])

  const stagesCards: JSX.Element[] = []
  if (pipeline.stages && pipeline.stages?.length > 0) {
    pipeline.stages.forEach(data => {
      if (data.parallel && data.parallel.length > 0) {
        data.parallel.forEach((nodeP: StageElementWrapper) => {
          nodeP.stage && stagesCards.push(renderForStage(nodeP.stage))
        })
      } else if (data.stage) {
        stagesCards.push(renderForStage(data.stage))
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
          <div className={css.treeContainer}>
            <Tree
              contents={nodes}
              onNodeClick={node => {
                forEachNode(nodes, n => (n.isSelected = false))
                if (node.hasCaret) {
                  node.isExpanded = !node.isExpanded
                } else {
                  node.isSelected = true
                }
                updateNodes(cloneDeep(nodes))
              }}
              onNodeCollapse={node => {
                node.isExpanded = false
                updateNodes(cloneDeep(nodes))
              }}
              onNodeExpand={node => {
                node.isExpanded = true
                updateNodes(cloneDeep(nodes))
              }}
            />
          </div>
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
                factory={factory}
                initialValues={{ variables: (pipeline as any).variables || [] }}
                type={StepType.CustomVariable}
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
      <RightBar />
    </div>
  )
}
