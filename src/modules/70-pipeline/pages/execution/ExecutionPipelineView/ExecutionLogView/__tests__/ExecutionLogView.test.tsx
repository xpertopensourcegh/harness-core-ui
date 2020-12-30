import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper, NotFound } from '@common/utils/testUtils'
import { getPipelineStagesMap } from '@pipeline/utils/executionUtils'
import ExecutionContext from '../../../ExecutionContext/ExecutionContext'
import ExecutionLogView from '../ExecutionLogView'
import type { ExecutionContextParams } from '../../../ExecutionContext/ExecutionContext'
import mock from '../../ExecutionGraphView/__tests__/mock.json'

const contextValue: ExecutionContextParams = {
  pipelineExecutionDetail: mock.data as any,
  allNodeMap: mock.data.executionGraph.nodeMap as any,
  pipelineStagesMap: getPipelineStagesMap(
    mock.data.pipelineExecutionSummary.layoutNodeMap as any,
    mock.data.pipelineExecutionSummary.startingNodeId
  ),
  selectedStageId: 'google_1',
  selectedStepId: '',
  queryParams: {},
  loading: false
}

describe('<ExecutionLogView /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(
      <TestWrapper>
        <ExecutionContext.Provider value={contextValue}>
          <ExecutionLogView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('stage selection works', async () => {
    const { findByText, getByTestId } = render(
      <TestWrapper>
        <ExecutionContext.Provider value={contextValue}>
          <ExecutionLogView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )

    const stageBtn = await findByText('google_1')

    fireEvent.click(stageBtn!)

    const stage = await findByText('google_2')

    fireEvent.click(stage)

    expect(getByTestId('location').innerHTML).toContain('stage=google_2')
  })
})
