import React from 'react'
import { render } from '@testing-library/react'
import { cloneDeep } from 'lodash-es'
import type { OrchestrationGraphDTO, ResponseCIBuildResponseDTO } from 'services/ci'
import { BuildData, BuildPageContext, BuildPageContextInterface } from '@ci/pages/build/context/BuildPageContext'
import { graph2ExecutionPipeline } from '@ci/pages/build/utils/api2ui'
import BuildPipelineGraph from '../BuildPipelineGraph'
import { BuildPipelineGraphLayoutType } from '../BuildPipelineGraphLayout/BuildPipelineGraphLayout'

import buildMock from './mock/buildMock.json'
jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

const getContextValue = (): Partial<BuildPageContextInterface> => {
  const response = cloneDeep(buildMock)

  const buildData: BuildData = {
    response: response as ResponseCIBuildResponseDTO,
    stagePipeline: graph2ExecutionPipeline(response?.data?.graph as OrchestrationGraphDTO),
    defaultSelectedStageIdentifier: 'springbootbuild',
    defaultSelectedStepIdentifier: '-1',
    globalErrorMessage: null
  }

  return {
    state: {
      selectedStageIdentifier: '1',
      selectedStepIdentifier: '2',
      graphLayoutType: BuildPipelineGraphLayoutType.BOTTOM,
      globalErrorMessage: ''
    },
    setSelectedStageIdentifier: () => ({}),
    setSelectedStepIdentifier: () => ({}),
    buildData: buildData,
    logs: [],
    setGraphLayoutType: () => ({})
  } as Partial<BuildPageContextInterface>
}

jest.mock('@pipeline/exports', () => ({
  ...(jest.requireActual('@pipeline/exports') as object),
  ExecutionStageDiagram() {
    return <div />
  }
}))

describe('BuildPipelineGraph snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(
      <BuildPageContext.Provider value={getContextValue() as BuildPageContextInterface}>
        <BuildPipelineGraph />
      </BuildPageContext.Provider>
    )
    expect(container).toMatchSnapshot()
  })
})
