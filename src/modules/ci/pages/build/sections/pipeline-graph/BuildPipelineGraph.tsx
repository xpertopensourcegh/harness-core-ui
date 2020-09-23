import React from 'react'
import SplitPane, { Pane } from 'react-split-pane'
import cx from 'classnames'
import { Icon, Container, Select, Tab, Tabs } from '@wings-software/uikit'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'
import { BuildPageContext } from '../../context/BuildPageContext'
import { getSelectOptionsFromExecutionPipeline, getStepsPipelineFromExecutionPipeline } from './BuildPipelineGraphUtils'
import i18n from './BuildPipelineGraph.i18n'

// TODO: Remove this dependency
import cssTmp from '../../../../../cd/pages/pipeline-studio/StageBuilder/StageBuilder.module.scss'

import css from './BuildPipelineGraph.module.scss'

const PipelineGraph: React.FC = () => {
  const {
    state: { selectedStageIdentifier, selectedStepIdentifier },
    setSelectedStageIdentifier,
    setSelectedStepIdentifier,
    buildData
  } = React.useContext(BuildPageContext)

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === selectedStageIdentifier)
  const executionSteps = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, selectedStageIdentifier)

  return (
    <Container className={css.main}>
      <SplitPane size={300} split="horizontal" minSize={100}>
        <Pane className={cx(cssTmp.canvas, css.canvas)}>
          <ExecutionStageDiagram
            data={buildData?.stagePipeline}
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
          </Pane>
        </SplitPane>
      </SplitPane>
    </Container>
  )
}

export default PipelineGraph
