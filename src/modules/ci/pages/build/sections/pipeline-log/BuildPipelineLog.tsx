import React, { useEffect, useState } from 'react'
import { Container, Select, Layout } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import ElapsedTime from 'modules/ci/components/ElapsedTime/ElapsedTime'
import { BuildPageContext } from '../../context/BuildPageContext'
import {
  getFlattenItemsFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from '../pipeline-graph/BuildPipelineGraphUtils'

import type { BuildPageUrlParams } from '../../CIBuildPage'

import { getLogsFromBlob } from '../../../../services/LogService'
import { BuildStep } from '../../../../components/BuildSteps/BuildStep'
import LogViewContainer from '../../../../components/LogViewContainer/LogViewContainer'
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
    state: { selectedStageIdentifier },
    setSelectedStageIdentifier,
    setSelectedStepIdentifier,
    buildData
  } = React.useContext(BuildPageContext)

  const { orgIdentifier, projectIdentifier, buildIdentifier } = useParams<BuildPageUrlParams>()

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === selectedStageIdentifier)
  const executionSteps = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, selectedStageIdentifier)
  const stepItems = getFlattenItemsFromPipeline(executionSteps)

  // TO DO use names from context
  const [selectedStep, setSelectedStep] = useState(executionSteps.items[0].item.name || '')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedStage, setSelectedStage] = useState(stagesSelectOptions[0].label || '')
  const [logs, setLogs] = useState<[]>([])

  // TODO: hardcoded for demo
  useEffect(() => {
    getLogsFromBlob(
      'zEaak-FLS425IEO7OLzMUg',
      orgIdentifier,
      projectIdentifier,
      buildIdentifier,
      selectedStage,
      selectedStep,
      setLogs
    )
  }, [selectedStep])

  const onStepClick = (identifier: string, name: string) => {
    setSelectedStep(name)
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

  const header = (
    <Container className={css.header}>
      <Select
        items={stagesSelectOptions}
        value={selectedStageOption}
        onChange={item => {
          setSelectedStageIdentifier(item.value as string)
          setSelectedStage(item.label)
        }}
        className={css.stageSelector}
      />
      <ElapsedTime className={css.timer} startTime={Math.floor(Date.now() / 1000) - 1000} />
    </Container>
  )

  return (
    <Layout.Vertical>
      {header}
      <Layout.Horizontal padding={{ right: 'xxlarge' }} className={css.wrapper}>
        <div className={css.steps}>
          <ul className="pipeline-steps">{steps}</ul>
        </div>
        <LogViewContainer
          downloadLogs={() => {
            alert('Log download')
          }}
          logsViewerSections={{ logs: logs }}
        />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default PipelineLog
