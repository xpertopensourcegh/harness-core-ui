import React from 'react'
import type { GetDataError } from 'restful-react'
import type { BuildData } from 'modules/ci/services/Types'
import type { ErrorResponse } from 'modules/ci/services/BuildsService'
import { BuildPipelineGraphLayoutType } from '../sections/pipeline-graph/BuildPipelineGraphLayout/BuildPipelineGraphLayout'

export interface BuildPageStateInterface {
  selectedStageIdentifier: string
  selectedStepIdentifier: string
  graphLayoutType: BuildPipelineGraphLayoutType
  globalErrorMessage: string | null
}

export interface BuildPageContextInterface {
  state: BuildPageStateInterface
  logs: Array<any>
  setSelectedStageIdentifier: (identifier: string) => void
  setSelectedStepIdentifier: (identifier: string) => void
  setGraphLayoutType: (graphLayoutType: BuildPipelineGraphLayoutType) => void
  buildData: BuildData | null
  loading: boolean
  error: GetDataError<ErrorResponse> | null
}

export const initialBuildPageState: BuildPageContextInterface = {
  state: {
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1',
    graphLayoutType: BuildPipelineGraphLayoutType.RIGHT,
    globalErrorMessage: null
  },
  logs: [],
  buildData: null,
  loading: false,
  error: null,
  setSelectedStageIdentifier: () => undefined,
  setSelectedStepIdentifier: () => undefined,
  setGraphLayoutType: () => undefined
}

export const BuildPageContext = React.createContext(initialBuildPageState)
