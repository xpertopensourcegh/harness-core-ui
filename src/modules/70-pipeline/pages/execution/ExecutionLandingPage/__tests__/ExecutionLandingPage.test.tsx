import React from 'react'
import { render, fireEvent, act, findByText as findByTextContainer } from '@testing-library/react'

import { TestWrapper, NotFound } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, executionPathProps } from '@common/utils/routeUtils'
import { useGetPipelineExecutionDetail } from 'services/cd-ng'

import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import { getRunningStageForPipeline } from '@pipeline/utils/executionUtils'
import ExecutionLandingPage, { POLL_INTERVAL } from '../ExecutionLandingPage'
import i18nTabs from '../ExecutionTabs/ExecutionTabs.i18n'
import mockData from './mock.json'

jest.mock('services/cd-ng', () => ({
  useGetPipelineExecutionDetail: jest.fn(() => ({
    refetch: jest.fn(),
    loading: false,
    data: {
      data: { pipelineExecution: {}, stageGraph: {} }
    }
  })),
  useHandleInterrupt: jest.fn(() => ({
    mutate: jest.fn()
  }))
}))

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => () => <div>YAMLBuilder</div>)

jest.useFakeTimers()

const TEST_EXECUTION_PATH = routes.toCDExecution({ ...accountPathProps, ...executionPathProps })
const TEST_EXECUTION_PIPELINE_PATH = routes.toCDExecutionPiplineView({ ...accountPathProps, ...executionPathProps })

describe('<ExecutionLandingPage /> tests', () => {
  const pathParams = {
    accountId: 'TEST_ACCOUNT_ID',
    orgIdentifier: 'TEST_ORG',
    projectIdentifier: 'TEST_PROJECT',
    pipelineIdentifier: 'TEST_PIPELINE',
    executionIdentifier: 'TEST_EXECUTION'
  }

  test('loading state - snapshot test', () => {
    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch: jest.fn(),
      loading: true,
      data: null
    }))
    const { container } = render(
      <TestWrapper path={TEST_EXECUTION_PATH} pathParams={pathParams}>
        <ExecutionLandingPage>
          <div data-testid="children">Execution Landing Page</div>
        </ExecutionLandingPage>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test.each<[string, string]>([
    [i18nTabs.piplines, routes.toCDExecutionPiplineView(pathParams)],
    [i18nTabs.inputs, routes.toCDExecutionInputsView(pathParams)],
    [i18nTabs.artifacts, routes.toCDExecutionArtifactsView(pathParams)]
  ])('Navigation to "%s" Tabs work', async (tab, url) => {
    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch: jest.fn(),
      loading: true,
      data: null
    }))
    const { container, getByTestId } = render(
      <TestWrapper path={TEST_EXECUTION_PATH} pathParams={pathParams}>
        <ExecutionLandingPage>
          <div data-testid="children">Execution Landing Page</div>
        </ExecutionLandingPage>
      </TestWrapper>
    )

    const tabElem = await findByTextContainer(container.querySelector('.tabs') as HTMLElement, tab)

    fireEvent.click(tabElem.closest('a')!)
    expect(getByTestId('location').innerHTML.endsWith(url)).toBe(true)
  })

  test.each<[string, string]>([
    [i18nTabs.graphView, routes.toCDExecutionPiplineView(pathParams) + '?view=graph'],
    [i18nTabs.logView, routes.toCDExecutionPiplineView(pathParams) + '?view=log']
  ])('Navigation to "%s" Tabs work', async (tab, url) => {
    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch: jest.fn(),
      loading: false,
      data: null
    }))
    const { findByText, getByTestId } = render(
      <TestWrapper path={TEST_EXECUTION_PIPELINE_PATH} pathParams={pathParams}>
        <ExecutionLandingPage>
          <NotFound />
        </ExecutionLandingPage>
      </TestWrapper>
    )

    const tabElem = await findByText(tab)

    fireEvent.click(tabElem)

    expect(getByTestId('location').innerHTML.endsWith(url)).toBe(true)
  })

  test.each<[ExecutionStatus, boolean]>([
    ['Aborted', false],
    ['Running', true]
  ])('For status "%s" - polling is `%s`', (executionStatus, called) => {
    const refetch = jest.fn()

    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch,
      loading: false,
      data: { data: { pipelineExecution: { executionStatus } } }
    }))

    render(
      <TestWrapper path={TEST_EXECUTION_PATH} pathParams={pathParams}>
        <ExecutionLandingPage>
          <div data-testid="children">Execution Landing Page</div>
        </ExecutionLandingPage>
      </TestWrapper>
    )

    act(() => {
      jest.advanceTimersByTime(POLL_INTERVAL + 100)
    })

    expect(refetch).toHaveBeenCalledTimes(called ? 1 : 0)
  })

  test('Toggle details works', async () => {
    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch: jest.fn(),
      loading: false,
      data: mockData
    }))

    const { container, findByTestId } = render(
      <TestWrapper path={TEST_EXECUTION_PIPELINE_PATH} pathParams={pathParams}>
        <ExecutionLandingPage>
          <NotFound />
        </ExecutionLandingPage>
      </TestWrapper>
    )

    const toggle = await findByTestId('toggle-details')

    expect(container).toMatchSnapshot('Without Details')

    fireEvent.click(toggle)

    expect(container).toMatchSnapshot('With Details')
  })

  test('auto stage selection works', () => {
    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch: jest.fn(),
      loading: true,
      data: mockData
    }))

    function Child(): React.ReactElement {
      const { selectedStageId, selectedStepId } = useExecutionContext()

      return (
        <React.Fragment>
          <div data-testid="autoSelectedStageId">{selectedStageId}</div>
          <div data-testid="autoSelectedStepId">{selectedStepId}</div>
        </React.Fragment>
      )
    }

    const { getByTestId } = render(
      <TestWrapper path={TEST_EXECUTION_PIPELINE_PATH} pathParams={pathParams}>
        <ExecutionLandingPage>
          <Child />
        </ExecutionLandingPage>
      </TestWrapper>
    )

    const stage = getRunningStageForPipeline(
      mockData.data.pipelineExecution.stageExecutionSummaryElements,
      mockData.data.pipelineExecution.executionStatus as ExecutionStatus
    )

    jest.runOnlyPendingTimers()

    expect(getByTestId('autoSelectedStageId').innerHTML).toBe(stage)
    expect(getByTestId('autoSelectedStepId').innerHTML).toBe('')
  })

  test('auto stage should not work when user has selected a stage/step', () => {
    ;(useGetPipelineExecutionDetail as jest.Mock).mockImplementation(() => ({
      refetch: jest.fn(),
      loading: false,
      data: mockData
    }))

    function Child(): React.ReactElement {
      const { selectedStageId, selectedStepId } = useExecutionContext()

      return (
        <React.Fragment>
          <div data-testid="autoSelectedStageId">{selectedStageId}</div>
          <div data-testid="autoSelectedStepId">{selectedStepId}</div>
        </React.Fragment>
      )
    }

    const { getByTestId } = render(
      <TestWrapper path={TEST_EXECUTION_PIPELINE_PATH} queryParams={{ stage: 'qaStage' }} pathParams={pathParams}>
        <ExecutionLandingPage>
          <Child />
        </ExecutionLandingPage>
      </TestWrapper>
    )

    expect(getByTestId('autoSelectedStageId').innerHTML).toBe('')
    expect(getByTestId('autoSelectedStepId').innerHTML).toBe('')
  })
})
