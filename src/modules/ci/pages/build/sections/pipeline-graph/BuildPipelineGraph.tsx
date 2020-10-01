import React from 'react'
import moment from 'moment'
import { Button, Color, Select, Text } from '@wings-software/uikit'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'
import LogViewContainer from 'modules/ci/components/LogViewContainer/LogViewContainer'
import { RoundButtonGroup } from 'modules/ci/components/RoundButtonGroup/RoundButtonGroup'
import { formatElapsedTime } from 'modules/ci/components/common/time'
import BuildPipelineGraphLayout, {
  BuildPipelineGraphLayoutType
} from './BuildPipelineGraphLayout/BuildPipelineGraphLayout'
import { BuildPageContext } from '../../context/BuildPageContext'
import {
  getItemFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from './BuildPipelineGraphUtils'
import i18n from './BuildPipelineGraph.i18n'
import css from './BuildPipelineGraph.module.scss'

const PipelineGraph: React.FC = () => {
  const {
    state: { selectedStageIdentifier, selectedStepIdentifier, graphLayoutType },
    setSelectedStageIdentifier,
    setSelectedStepIdentifier,
    buildData,
    logs,
    setGraphLayoutType
  } = React.useContext(BuildPageContext)

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === selectedStageIdentifier)
  const executionSteps = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, selectedStageIdentifier)
  const selectedStep = getItemFromPipeline(executionSteps, selectedStepIdentifier)

  // Stage select
  const stageSelect = (
    <Select
      items={stagesSelectOptions}
      value={selectedStageOption}
      onChange={item => {
        setSelectedStageIdentifier(item.value as string)
      }}
    />
  )

  // Stages pipeline
  const stagesPipeline = (
    <ExecutionStageDiagram
      data={buildData?.stagePipeline}
      selectedIdentifier={selectedStageIdentifier}
      nodeStyle={{
        width: 114,
        height: 50
      }}
      gridStyle={{
        startY: 50
      }}
      itemClickHandler={event => {
        setSelectedStageIdentifier(event.stage.identifier)
      }}
    />
  )

  // Steps pipeline
  const stepsPipeline = (
    <ExecutionStageDiagram
      data={executionSteps}
      selectedIdentifier={selectedStepIdentifier}
      nodeStyle={{
        width: 80,
        height: 80
      }}
      gridStyle={{
        startY: 120
      }}
      itemClickHandler={event => {
        setSelectedStepIdentifier(event.stage.identifier)
      }}
    />
  )

  // Step title
  const stepTitle = <Text color={Color.GREY_500}>STEP: {selectedStep?.name}</Text>

  // Step tabs
  const stepTabs = [
    {
      title: <Text>{i18n.stepTabDetails}</Text>,
      content: (
        <table className={css.stepDetailsTable}>
          <tr>
            <td>{i18n.startedAt}</td>
            <td>{selectedStep?.data?.startTs && moment(selectedStep?.data?.startTs).format('M/D/YYYY h:mm:ss a')}</td>
          </tr>
          <tr>
            <td>{i18n.endedAt}</td>
            <td>{selectedStep?.data?.endTs && moment(selectedStep?.data?.endTs).format('M/D/YYYY h:mm:ss a')}</td>
          </tr>
          <tr>
            <td>{i18n.duration}</td>
            <td>
              {selectedStep?.data?.startTs &&
                selectedStep?.data?.endTs &&
                formatElapsedTime(selectedStep?.data?.endTs - selectedStep?.data?.startTs, true)}
            </td>
          </tr>
        </table>
      )
    },
    {
      title: <Text>{i18n.stepTabInput}</Text>,
      content: <Text>Input (TBD)</Text>
    },
    {
      title: <Text>{i18n.stepTabOutput}</Text>,
      content: <Text>Output (TBD)</Text>
    }
  ]

  // Step logs
  const stepLogs = (
    <LogViewContainer
      downloadLogs={() => {
        // TODO: log download
        alert('Log download')
      }}
      logsViewerSections={{ logs: logs }}
      showSummary={false}
    />
  )

  const changeLayout = (
    <RoundButtonGroup>
      <Button
        icon="layout-right"
        active={graphLayoutType === BuildPipelineGraphLayoutType.RIGHT}
        onClick={() => setGraphLayoutType(BuildPipelineGraphLayoutType.RIGHT)}
      ></Button>
      <Button
        icon="layout-bottom"
        active={graphLayoutType === BuildPipelineGraphLayoutType.BOTTOM}
        onClick={() => setGraphLayoutType(BuildPipelineGraphLayoutType.BOTTOM)}
      ></Button>
      <Button
        icon="layout-float"
        active={graphLayoutType === BuildPipelineGraphLayoutType.FLOAT}
        onClick={() => setGraphLayoutType(BuildPipelineGraphLayoutType.FLOAT)}
      ></Button>
    </RoundButtonGroup>
  )
  return (
    <BuildPipelineGraphLayout
      layoutType={graphLayoutType}
      changeLayout={changeLayout}
      stageSelect={stageSelect}
      stagesPipeline={stagesPipeline}
      stepsPipeline={stepsPipeline}
      stepTitle={stepTitle}
      stepTabs={stepTabs}
      stepLogs={stepLogs}
    />
  )
}

export default PipelineGraph
