import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getLogsFromBlob, useLogs } from 'modules/ci/services/LogService'
import { useGetBuild } from 'modules/ci/services/BuildsService'
import { ExecutionPipelineItemStatus } from 'modules/common/components/ExecutionStageDiagram/ExecutionPipelineModel'
import type { BuildPageUrlParams } from '../CIBuildPage'
import { BuildPageContext, BuildPageStateInterface } from './BuildPageContext'
import {
  getDefaultSelectionFromExecutionPipeline,
  getFirstItemIdFromExecutionPipeline,
  graph2ExecutionPipeline
} from '../utils/api2ui'
import {
  getFlattenItemsFromPipeline,
  getSelectOptionsFromExecutionPipeline,
  getStepsPipelineFromExecutionPipeline
} from '../../build/sections/pipeline-graph/BuildPipelineGraphUtils'
import { BuildPipelineGraphLayoutType } from '../sections/pipeline-graph/BuildPipelineGraphLayout/BuildPipelineGraphLayout'

export const BuildPageContextProvider: React.FC = props => {
  const { children } = props
  const { orgIdentifier, projectIdentifier, buildIdentifier } = useParams<BuildPageUrlParams>()
  const [state, setState] = React.useState<BuildPageStateInterface>({
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1',
    graphLayoutType: BuildPipelineGraphLayoutType.COMBINED
  })

  const [logs, setLogs] = React.useState<Array<any>>([])

  const setSelectedStageIdentifier = (selectedStageIdentifier: string): void => {
    if (selectedStageIdentifier === state.selectedStageIdentifier) return

    // select default (first step in the pipeline)
    const pipeline = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, selectedStageIdentifier)
    const selectedStepIdentifier = getFirstItemIdFromExecutionPipeline(pipeline)

    setState({ ...state, selectedStageIdentifier, selectedStepIdentifier })
  }

  const setSelectedStepIdentifier = (selectedStepIdentifier: string): void => {
    if (selectedStepIdentifier === state.selectedStepIdentifier) return
    setState({ ...state, selectedStepIdentifier })
  }

  const setGraphLayoutType = (graphLayoutType: BuildPipelineGraphLayoutType): void => {
    setState({ ...state, graphLayoutType })
  }

  const { data: buildData, loading, error } = useGetBuild(buildIdentifier, {
    queryParams: {
      // TODO: HARDCODED FOR DEMO
      accountIdentifier: 'zEaak-FLS425IEO7OLzMUg',
      orgIdentifier,
      projectIdentifier
    },
    resolve: response => {
      // api2ui model
      const stagePipeline = graph2ExecutionPipeline(response.data.graph)

      // default selected stage and step
      const {
        defaultSelectedStageIdentifier,
        defaultSelectedStepIdentifier
      } = getDefaultSelectionFromExecutionPipeline(stagePipeline)

      return {
        response,
        stagePipeline,
        defaultSelectedStageIdentifier,
        defaultSelectedStepIdentifier
      }
    }
  })

  const stagesSelectOptions = getSelectOptionsFromExecutionPipeline(buildData?.stagePipeline)
  const selectedStageOption = stagesSelectOptions.find(item => item.value === state.selectedStageIdentifier)
  const executionSteps = getStepsPipelineFromExecutionPipeline(buildData?.stagePipeline, state.selectedStageIdentifier)
  const stepItems = getFlattenItemsFromPipeline(executionSteps)
  const selectedStep = stepItems.find(item => item.identifier === state.selectedStepIdentifier)?.name
  const isStepRunning =
    stepItems.find(item => item.identifier === state.selectedStepIdentifier)?.status ===
    ExecutionPipelineItemStatus.RUNNING
  // by default fist stage/step is selected
  useEffect(() => {
    setState({
      ...state,
      selectedStageIdentifier: buildData?.defaultSelectedStageIdentifier as string,
      selectedStepIdentifier: buildData?.defaultSelectedStepIdentifier as string
    })
  }, [buildData?.defaultSelectedStageIdentifier, buildData?.defaultSelectedStepIdentifier])

  const [logsStream] = useLogs(
    'zEaak-FLS425IEO7OLzMUg',
    orgIdentifier,
    projectIdentifier,
    buildIdentifier,
    selectedStageOption?.label || '',
    selectedStep || '',
    isStepRunning && !!selectedStageOption && !!selectedStep
  )

  useEffect(() => {
    !isStepRunning &&
      selectedStageOption &&
      selectedStep &&
      getLogsFromBlob(
        'zEaak-FLS425IEO7OLzMUg',
        orgIdentifier,
        projectIdentifier,
        buildIdentifier,
        selectedStageOption?.label || '',
        selectedStep || '',
        setLogs
      )
  }, [state.selectedStepIdentifier])

  return (
    <BuildPageContext.Provider
      value={{
        state,
        buildData,
        loading,
        error,
        logs: isStepRunning ? logsStream : logs,
        setSelectedStageIdentifier,
        setSelectedStepIdentifier,
        setGraphLayoutType
      }}
    >
      {children}
    </BuildPageContext.Provider>
  )
}
