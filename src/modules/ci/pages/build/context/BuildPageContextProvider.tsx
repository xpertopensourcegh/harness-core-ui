import React from 'react'
import type { BuildResponse } from 'modules/ci/services/Types'
import { BuildPageContext, BuildPageStateInterface } from './BuildPageContext'

export const BuildPageContextProvider: React.FC = props => {
  const { children } = props
  const [state, setState] = React.useState<BuildPageStateInterface>({
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1',
    buildData: undefined
  })

  const setSelectedStageIdentifier = (selectedStageIdentifier: string): void => {
    if (selectedStageIdentifier === state.selectedStageIdentifier) return
    setState({ ...state, selectedStageIdentifier, selectedStepIdentifier: '-1' })
  }

  const setSelectedStepIdentifier = (selectedStepIdentifier: string): void => {
    if (selectedStepIdentifier === state.selectedStepIdentifier) return
    setState({ ...state, selectedStepIdentifier })
  }

  const setBuildData = (buildData: BuildResponse | undefined): void => {
    setState({ ...state, buildData })
  }

  return (
    <BuildPageContext.Provider value={{ state, setSelectedStageIdentifier, setSelectedStepIdentifier, setBuildData }}>
      {children}
    </BuildPageContext.Provider>
  )
}
