import React from 'react'
import { Container, Select, Layout } from '@wings-software/uikit'
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

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline).map(item => {
    return { label: item.label, value: item.value }
  })
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

  return (
    <Layout.Horizontal className={css.wrapper}>
      <Container className={css.selectContainer}>
        <div className={css.selectDiv}>
          <Select
            items={stagesSelectOptions}
            value={selectedStageOption}
            onChange={item => {
              setSelectedStageIdentifier(item.value as string)
            }}
            className={css.stageSelector}
          />
        </div>
        <div className={css.steps}>
          <ul className="pipeline-steps">{steps}</ul>
        </div>
      </Container>
      <Container height="100%" width="100%">
        <LogViewContainer
          downloadLogs={() => {
            alert('Log download')
          }}
          logsViewerSections={{ logs: logs }}
        />
      </Container>
    </Layout.Horizontal>
  )
}

export default PipelineLog
