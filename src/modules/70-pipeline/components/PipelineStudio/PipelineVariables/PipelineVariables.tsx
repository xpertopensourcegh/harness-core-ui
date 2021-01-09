import React from 'react'
import { Text, Color, NestedAccordionProvider, useNestedAccordion } from '@wings-software/uicore'
import type { ITreeNode } from '@blueprintjs/core'

import type { StageElementWrapper } from 'services/cd-ng'

import i18n from './PipelineVariables.i18n'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { getPipelineTree } from '../PipelineUtils'
import StagesTree, { stagesTreeNodeClasses } from '../../StagesThree/StagesTree'
import PipelineCard from './PipelineCard'
import StageCard from './StageCard'

import css from './PipelineVariables.module.scss'

export const PipelineVariables: React.FC = (): JSX.Element => {
  const {
    state: { pipeline },
    updatePipeline,
    stepsFactory
  } = React.useContext(PipelineContext)

  const { openNestedPath } = useNestedAccordion()

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
          nodeP.stage &&
            stagesCards.push(
              <StageCard
                key={nodeP.stage.identifier}
                stage={nodeP.stage}
                factory={stepsFactory}
                pipeline={pipeline}
                updatePipeline={updatePipeline}
              />
            )
        })
      } /* istanbul ignore else */ else if (data.stage) {
        stagesCards.push(
          <StageCard
            key={data.stage.identifier}
            stage={data.stage}
            factory={stepsFactory}
            pipeline={pipeline}
            updatePipeline={updatePipeline}
          />
        )
      }
    })
  }

  function handleSelectionChange(id: string): void {
    setSelectedTreeNodeId(id)
    openNestedPath(id)
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
            selectionChange={handleSelectionChange}
          />
          <div className={css.variableList}>
            <Text className={css.title} color={Color.BLACK}>
              {i18n.pipeline}
            </Text>
            <div className={css.variableListHeader}>
              <Text font={{ size: 'small' }}>{i18n.variables}</Text>
              <Text font={{ size: 'small' }}>{i18n.type}</Text>
              <Text font={{ size: 'small' }}>{i18n.values}</Text>
            </div>
            <PipelineCard pipeline={pipeline} stepsFactory={stepsFactory} updatePipeline={updatePipeline} />
            {stagesCards}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PipelineVariablesWrapper(): React.ReactElement {
  return (
    <NestedAccordionProvider>
      <PipelineVariables />
    </NestedAccordionProvider>
  )
}
