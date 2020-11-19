import React from 'react'
import { Container, Select, Layout } from '@wings-software/uikit'
import { formatElapsedTime } from '@ci/components/common/time'
import LogViewContainer from '@ci/components/LogViewContainer/LogViewContainer'
import { BuildStep } from '@ci/components/BuildSteps/BuildStep'
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
    logs,
    isStepRunning
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
    const time =
      item?.data?.step?.startTs && item?.data?.step.endTs
        ? formatElapsedTime(item?.data?.step?.endTs / 1000 - item?.data?.step?.startTs / 1000, true)
        : ''
    return (
      <BuildStep
        identifier={item.identifier}
        onStepClick={onStepClick}
        key={key}
        isSelected={isSelected}
        isSubStep={false}
        status={item.status}
        label={item.name}
        time={time}
      />
    )
  })

  return (
    <Container className={css.main}>
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
            isStepRunning={isStepRunning}
          />
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

export default PipelineLog
