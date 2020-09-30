import React from 'react'
import { Container, Select, Layout } from '@wings-software/uikit'
import ElapsedTime from 'modules/ci/components/ElapsedTime/ElapsedTime'
import LogViewContainer from 'modules/ci/components/LogViewContainer/LogViewContainer'
import { BuildStep } from 'modules/ci/components/BuildSteps/BuildStep'
import { BuildPageContext } from '../../context/BuildPageContext'
import {
  getFlattenItemsFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from '../pipeline-graph/BuildPipelineGraphUtils'
import css from './BuildPipelineLog.module.scss'

export interface LogResponse {
  args: any
  level: string
  out: string
  pos: number
  time: string
}

const PipelineLog: React.FC = () => {
  const {
    state: { selectedStageIdentifier, selectedStepIdentifier },
    setSelectedStageIdentifier,
    setSelectedStepIdentifier,
    buildData,
    logs
  } = React.useContext(BuildPageContext)

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === selectedStageIdentifier)
  const executionSteps = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, selectedStageIdentifier)
  const stepItems = getFlattenItemsFromPipeline(executionSteps)
  const selectedStep = stepItems.find(item => item.identifier === selectedStepIdentifier)?.name

  const onStepClick = (identifier: string): void => {
    setSelectedStepIdentifier(identifier)
  }

  const steps = stepItems.map((item, key) => {
    const isSelected = item.name === selectedStep

    return (
      <BuildStep
        identifier={item.identifier}
        onStepClick={onStepClick}
        key={key}
        isSelected={isSelected}
        isSubStep={false}
        status={item.status}
        label={item.name}
        time={1000}
      />
    )
  })

  // TODO: Add time from API
  const header = (
    <Container className={css.header}>
      <Select
        items={stagesSelectOptions}
        value={selectedStageOption}
        onChange={item => {
          setSelectedStageIdentifier(item.value as string)
        }}
        className={css.stageSelector}
      />
      <ElapsedTime className={css.timer} startTime={Math.floor(Date.now() / 1000)} />
    </Container>
  )

  return (
    <Layout.Vertical className={css.main}>
      {header}
      <Layout.Horizontal className={css.wrapper}>
        <div className={css.steps}>
          <ul className="pipeline-steps">{steps}</ul>
        </div>
        <Container height="700px" width="100%">
          <LogViewContainer
            downloadLogs={() => {
              alert('Log download')
            }}
            logsViewerSections={{ logs: logs }}
          />
        </Container>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default PipelineLog
