import React, { useEffect, useState } from 'react'
import { Container, Select, Layout } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import ElapsedTime from 'modules/ci/components/ElapsedTime/ElapsedTime'
import LogViewContainer from 'modules/ci/components/LogViewContainer/LogViewContainer'
import { BuildStep } from 'modules/ci/components/BuildSteps/BuildStep'
import { getLogsFromBlob } from 'modules/ci/services/LogService'
import { BuildPageContext } from '../../context/BuildPageContext'
import {
  getFlattenItemsFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from '../pipeline-graph/BuildPipelineGraphUtils'

import type { BuildPageUrlParams } from '../../CIBuildPage'

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
    buildData
  } = React.useContext(BuildPageContext)

  const { orgIdentifier, projectIdentifier, buildIdentifier } = useParams<BuildPageUrlParams>()

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === selectedStageIdentifier)
  const executionSteps = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, selectedStageIdentifier)
  const stepItems = getFlattenItemsFromPipeline(executionSteps)
  const selectedStep = stepItems.find(item => item.identifier === selectedStepIdentifier)?.name

  const [logs, setLogs] = useState<[]>([])

  // TODO: hardcoded for demo
  useEffect(() => {
    getLogsFromBlob(
      'zEaak-FLS425IEO7OLzMUg',
      orgIdentifier,
      projectIdentifier,
      buildIdentifier,
      selectedStageOption?.label || '',
      selectedStep || '',
      setLogs
    )
  }, [selectedStep])

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
