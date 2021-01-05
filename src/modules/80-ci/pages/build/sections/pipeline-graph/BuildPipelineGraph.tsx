import React from 'react'
import { Button, Color, Select, Text, Icon } from '@wings-software/uicore'
import { ExecutionStageDiagram } from '@pipeline/exports'
import LogViewContainer from '@ci/components/LogViewContainer/LogViewContainer'
import { RoundButtonGroup } from '@ci/components/RoundButtonGroup/RoundButtonGroup'
import BuildPipelineGraphLayout, {
  BuildPipelineGraphLayoutType
} from './BuildPipelineGraphLayout/BuildPipelineGraphLayout'
import { BuildPageContext } from '../../context/BuildPageContext'
import {
  getItemFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from './BuildPipelineGraphUtils'
import StepDetails from './step-details/StepDetails'
import ServiceDetails from './service-details/ServiceDetails'
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
    <>
      {buildData?.stagePipeline && (
        <ExecutionStageDiagram
          data={buildData.stagePipeline}
          key={buildData?.stagePipeline.identifier}
          showStartEndNode={buildData?.stagePipeline && buildData?.stagePipeline.items.length > 0}
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
      )}
    </>
  )

  // Steps pipeline
  const stepsPipeline = (
    <ExecutionStageDiagram
      key={selectedStageIdentifier}
      data={executionSteps}
      showStartEndNode={executionSteps.items.length > 0}
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
  const stepTitle = selectedStep && (
    <div className={css.stepTitle}>
      <Text color={Color.GREY_500}>
        {selectedStep?.data?.service ? i18n.dependency : i18n.step} {selectedStep?.name}
      </Text>
      {selectedStep?.data?.step?.stepParameters?.skipCondition && (
        <Icon
          className={css.conditionalIcon}
          size={26}
          name={'conditional-skip-new'}
          color="white"
          margin={{ top: 'xsmall', left: 'xsmall' }}
        />
      )}
    </div>
  )

  // Step tabs
  const stepTabs = [
    {
      title: <Text>{i18n.stepTabDetails}</Text>,
      content:
        selectedStep &&
        (selectedStep.data?.service ? (
          <ServiceDetails service={selectedStep.data?.service} />
        ) : (
          <StepDetails step={selectedStep.data?.step} />
        ))
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
