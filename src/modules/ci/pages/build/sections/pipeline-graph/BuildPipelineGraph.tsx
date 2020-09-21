import React, { useState } from 'react'
import SplitPane, { Pane } from 'react-split-pane'
import cx from 'classnames'
import { Icon, Container, Button, Select, Tab, Tabs } from '@wings-software/uikit'
import type { ExecutionPipeline } from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'
import { BuildPageContext } from '../../context/BuildPageContext'
import { getSelectOptionsFromExecutionPipeline } from './BuildPipelineGraphUtils'
import i18n from './BuildPipelineGraph.i18n'

// TODO: temp dat
import { pipelineData as pipelineData0 } from './pipeline.mock.0'
import { pipelineData as pipelineData1 } from './pipeline.mock.1'
import { pipelineData as stepsData0 } from './steps.mock.0'

// TODO: Remove this dependency
import cssTmp from '../../../../../cd/pages/pipeline-studio/StageBuilder/StageBuilder.module.scss'

import css from './BuildPipelineGraph.module.scss'

const PipelineGraph: React.FC = () => {
  // TODO: implement these in BuildPageContext(Provider)
  const [executionPipeline, setExecutionPipeline] = useState<ExecutionPipeline<string>>(pipelineData0)
  const [executionSteps] = useState<ExecutionPipeline<string>>(stepsData0)

  const {
    state: { selectedStageIdentifier, selectedStepIdentifier },
    setSelectedStageIdentifier,
    setSelectedStepIdentifier
  } = React.useContext(BuildPageContext)

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(executionPipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === selectedStageIdentifier)

  return (
    <Container className={css.main}>
      <SplitPane size={300} split="horizontal" minSize={100}>
        <Pane className={cx(cssTmp.canvas, css.canvas)}>
          <ExecutionStageDiagram
            data={executionPipeline}
            selectedIdentifier={selectedStageIdentifier}
            nodeStyle={{
              width: 114,
              height: 50
            }}
            itemClickHandler={event => {
              setSelectedStageIdentifier(event.stage.identifier)
            }}
          />
        </Pane>
        <SplitPane split="vertical" size={'65%'}>
          <Pane className={css.bottomPane}>
            <Container className={css.stepsToolbar}>
              <Select
                className={css.stageSelect}
                items={stagesSelectOptions}
                value={selectedStageOption}
                onChange={item => {
                  setSelectedStageIdentifier(item.value as string)
                }}
              />
              <Tabs id="ciStepExecutionTabs">
                <Tab id="ciStepExecution" title={i18n.execution}></Tab>
              </Tabs>
              <div className={cssTmp.splitButtons}>
                <Icon name="up" size={15} className={cssTmp.stageDecrease} />
                <span className={cssTmp.separator} />
                <Icon name="down" size={15} className={cssTmp.stageIncrease} />
              </div>
            </Container>

            <Container style={{ position: 'relative', flexGrow: 1 }}>
              <Container className={cx(cssTmp.canvas, css.canvas)}>
                <ExecutionStageDiagram
                  data={executionSteps}
                  selectedIdentifier={selectedStepIdentifier}
                  nodeStyle={{
                    width: 80,
                    height: 80
                  }}
                  itemClickHandler={event => {
                    setSelectedStepIdentifier(event.stage.identifier)
                  }}
                />
              </Container>
            </Container>
          </Pane>
          <Pane className="">
            TODO: Add Step DETAILS and LOGS <br />
            <Button onClick={() => setExecutionPipeline(pipelineData0)}>Source 0</Button>
            <Button onClick={() => setExecutionPipeline(pipelineData1)}>Source 1</Button>
          </Pane>
        </SplitPane>
      </SplitPane>
    </Container>
  )
}

export default PipelineGraph
