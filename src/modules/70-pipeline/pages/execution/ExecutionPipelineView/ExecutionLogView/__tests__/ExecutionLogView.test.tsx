import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper, NotFound } from '@common/utils/testUtils'
import ExecutionContext from '../../../ExecutionContext/ExecutionContext'
import ExecutionLogView from '../ExecutionLogView'
import type { ExecutionContextParams } from '../../../ExecutionContext/ExecutionContext'
import { getPipelineStagesMap } from '../../../ExecutionUtils'
import mock from '../../ExecutionGraphView/__tests__/mock.json'

const contextValue: ExecutionContextParams = {
  pipelineExecutionDetail: mock.data as any,
  pipelineStagesMap: getPipelineStagesMap(mock as any),
  selectedStageId: 'qa stage4',
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

    const stageBtn = document.querySelector('.bp3-button-text')

    fireEvent.click(stageBtn!)

    const stage = await findByText('qa stage2')

    fireEvent.click(stage)

    expect(getByTestId('location').innerHTML).toContain('stage=qaStage2')
  })
})
