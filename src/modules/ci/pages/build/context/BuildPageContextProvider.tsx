import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetBuild } from 'modules/ci/services/BuildsService'
import type { BuildPageUrlParams } from '../CIBuildPage'
import { BuildPageContext, BuildPageStateInterface } from './BuildPageContext'
import {
  getDefaultSelectionFromExecutionPipeline,
  getFirstItemIdFromExecutionPipeline,
  graph2ExecutionPipeline
} from '../utils/api2ui'
import { getStepsPipelineFromExecutionPipeline } from '../sections/pipeline-graph/BuildPipelineGraphUtils'
import { BuildPipelineGraphLayoutType } from '../sections/pipeline-graph/BuildPipelineGraphLayout/BuildPipelineGraphLayout'

export const BuildPageContextProvider: React.FC = props => {
  const { children } = props
  const { orgIdentifier, projectIdentifier, buildIdentifier } = useParams<BuildPageUrlParams>()
  const [state, setState] = React.useState<BuildPageStateInterface>({
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1',
    graphLayoutType: BuildPipelineGraphLayoutType.COMBINED
  })

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

  // by default fist stage/step is selected
  useEffect(() => {
    setState({
      ...state,
      selectedStageIdentifier: buildData?.defaultSelectedStageIdentifier as string,
      selectedStepIdentifier: buildData?.defaultSelectedStepIdentifier as string
    })
  }, [buildData?.defaultSelectedStageIdentifier, buildData?.defaultSelectedStepIdentifier])

  return (
    <BuildPageContext.Provider
      value={{
        state,
        buildData,
        loading,
        error,
        setSelectedStageIdentifier,
        setSelectedStepIdentifier,
        setGraphLayoutType
      }}
    >
      {children}
    </BuildPageContext.Provider>
  )
}
