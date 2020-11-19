import React from 'react'
import type { GetDataError } from 'restful-react'
import type { ResponseCIBuildResponseDTO, GraphVertex } from 'services/ci'
import type { ExecutionPipeline } from '@pipeline/exports'
import { BuildPipelineGraphLayoutType } from '../sections/pipeline-graph/BuildPipelineGraphLayout/BuildPipelineGraphLayout'
import type { ServiceDependency } from '../utils/api2ui'

export interface ItemData {
  step?: GraphVertex
  service?: ServiceDependency
}

export interface BuildData {
  response: ResponseCIBuildResponseDTO | null
  stagePipeline: ExecutionPipeline<ItemData>
  defaultSelectedStageIdentifier: string
  defaultSelectedStepIdentifier: string
  globalErrorMessage: string | null
}

export interface BuildPageStateInterface {
  selectedStageIdentifier: string
  selectedStepIdentifier: string
  graphLayoutType: BuildPipelineGraphLayoutType
  globalErrorMessage: string | null
}

export interface BuildPageContextInterface {
  state: BuildPageStateInterface
  logs: Array<any>
  isStepRunning: boolean
  setSelectedStageIdentifier: (identifier: string) => void
  setSelectedStepIdentifier: (identifier: string) => void
  setGraphLayoutType: (graphLayoutType: BuildPipelineGraphLayoutType) => void
  buildData: BuildData | null
  loading: boolean
  error: GetDataError<unknown> | null
}

export const initialBuildPageState: BuildPageContextInterface = {
  state: {
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1',
    graphLayoutType: BuildPipelineGraphLayoutType.RIGHT,
    globalErrorMessage: null
  },
  logs: [],
  isStepRunning: false,
  buildData: null,
  loading: false,
  error: null,
  setSelectedStageIdentifier: () => undefined,
  setSelectedStepIdentifier: () => undefined,
  setGraphLayoutType: () => undefined
}

export const BuildPageContext = React.createContext(initialBuildPageState)
