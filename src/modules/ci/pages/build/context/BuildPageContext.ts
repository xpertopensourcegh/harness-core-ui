import React from 'react'
import type { BuildResponse } from 'modules/ci/services/Types'

export interface BuildPageStateInterface {
  selectedStageIdentifier: string
  selectedStepIdentifier: string
  buildData?: BuildResponse | undefined
}

export interface BuildPageContextInterface {
  state: BuildPageStateInterface
  setSelectedStageIdentifier: (identifier: string) => void
  setSelectedStepIdentifier: (identifier: string) => void
  setBuildData: (buildData: BuildResponse | undefined) => void
}

export const initialBuildPageState: BuildPageContextInterface = {
  state: {
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1',
    buildData: undefined
  },
  setSelectedStageIdentifier: () => undefined,
  setSelectedStepIdentifier: () => undefined,
  setBuildData: () => undefined
}

export const BuildPageContext = React.createContext(initialBuildPageState)
