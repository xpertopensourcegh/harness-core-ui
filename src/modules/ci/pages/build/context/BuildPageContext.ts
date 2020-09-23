import React from 'react'
import type { GetDataError } from 'restful-react'
import type { BuildData } from 'modules/ci/services/Types'
import type { ErrorResponse } from 'modules/ci/services/BuildsService'

export interface BuildPageStateInterface {
  selectedStageIdentifier: string
  selectedStepIdentifier: string
}

export interface BuildPageContextInterface {
  state: BuildPageStateInterface
  setSelectedStageIdentifier: (identifier: string) => void
  setSelectedStepIdentifier: (identifier: string) => void
  buildData: BuildData | null
  loading: boolean
  error: GetDataError<ErrorResponse> | null
}

export const initialBuildPageState: BuildPageContextInterface = {
  state: {
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1'
  },
  buildData: null,
  loading: false,
  error: null,
  setSelectedStageIdentifier: () => undefined,
  setSelectedStepIdentifier: () => undefined
}

export const BuildPageContext = React.createContext(initialBuildPageState)
