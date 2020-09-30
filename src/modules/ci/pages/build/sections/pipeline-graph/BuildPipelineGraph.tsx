import React from 'react'
import { Select, Text } from '@wings-software/uikit'
import ExecutionStageDiagram from 'modules/common/components/ExecutionStageDiagram/ExecutionStageDiagram'
import LogViewContainer from 'modules/ci/components/LogViewContainer/LogViewContainer'
import BuildPipelineGraphLayout from './BuildPipelineGraphLayout/BuildPipelineGraphLayout'
import { BuildPageContext } from '../../context/BuildPageContext'
import {
  getItemFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from './BuildPipelineGraphUtils'
import i18n from './BuildPipelineGraph.i18n'

const PipelineGraph: React.FC = () => {
  const {
    state: { selectedStageIdentifier, selectedStepIdentifier, graphLayoutType },
    setSelectedStageIdentifier,
    setSelectedStepIdentifier,
    buildData,
    logs
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
  const stepTitle = <Text>STEP: {selectedStep?.name}</Text>

  // Step tabs
  const stepTabs = [
    {
      title: <Text>{i18n.stepTabDetails}</Text>,
      content: (
        <table>
          <tr>
            <td>Started at:</td>
            <td>{selectedStep?.data?.lastUpdatedAt}</td>
          </tr>
          <tr>
            <td>Ended at:</td>
            <td>{selectedStep?.data?.endTs}</td>
          </tr>
          <tr>
            <td>Duration:</td>
            <td>25s</td>
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
    />
  )

  return (
    <BuildPipelineGraphLayout
      layoutType={graphLayoutType}
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
