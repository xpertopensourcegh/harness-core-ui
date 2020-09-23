import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetBuild } from 'modules/ci/services/BuildsService'
import type { BuildPageUrlParams } from '../CIBuildPage'
import { BuildPageContext, BuildPageStateInterface } from './BuildPageContext'
import { getDefaultSelectionFromExecutionPipeline, graph2ExecutionPipeline } from '../utils/api2ui'

export const BuildPageContextProvider: React.FC = props => {
  const { children } = props
  const { accountId: accountIdentifier, orgIdentifier, projectIdentifier, buildIdentifier } = useParams<
    BuildPageUrlParams
  >()
  const [state, setState] = React.useState<BuildPageStateInterface>({
    selectedStageIdentifier: '-1',
    selectedStepIdentifier: '-1'
  })

  const setSelectedStageIdentifier = (selectedStageIdentifier: string): void => {
    if (selectedStageIdentifier === state.selectedStageIdentifier) return
    setState({ ...state, selectedStageIdentifier, selectedStepIdentifier: '-1' })
  }

  const setSelectedStepIdentifier = (selectedStepIdentifier: string): void => {
    if (selectedStepIdentifier === state.selectedStepIdentifier) return
    setState({ ...state, selectedStepIdentifier })
  }

  const { data: buildData, loading, error } = useGetBuild(buildIdentifier, {
    queryParams: {
      accountIdentifier,
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
      selectedStageIdentifier: buildData?.defaultSelectedStageIdentifier as string,
      selectedStepIdentifier: buildData?.defaultSelectedStepIdentifier as string
    })
  }, [buildData?.defaultSelectedStageIdentifier, buildData?.defaultSelectedStepIdentifier])

  return (
    <BuildPageContext.Provider
      value={{ state, buildData, loading, error, setSelectedStageIdentifier, setSelectedStepIdentifier }}
    >
      {children}
    </BuildPageContext.Provider>
  )
}
