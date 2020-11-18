import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper, NotFound } from '@common/utils/testUtils'
import type { ExecutionNode } from 'services/cd-ng'

import type { ExecutionPipelineNode } from '@pipeline/components/ExecutionStageDiagram/ExecutionPipelineModel'
import type { ExecutionStageDiagramProps } from '@pipeline/components/ExecutionStageDiagram/ExecutionStageDiagram'
import ExecutionContext from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import type { ExecutionContextParams } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import { getPipelineStagesMap } from '@pipeline/pages/execution/ExecutionUtils'
import mock from './mock.json'
import ExecutionGraphView from '../ExecutionGraphView'

function renderNode(
  data: ExecutionPipelineNode<ExecutionNode>,
  itemClickHandler: ExecutionStageDiagramProps<ExecutionNode>['itemClickHandler']
): React.ReactElement {
  const { parallel, group, item } = data

  if (parallel) {
    return <div data-stage="parallel">{parallel.map(e => renderNode(e, itemClickHandler))}</div>
  }
  if (group) {
    return (
      <div data-stage="group" data-group={group.name}>
        {group.items.map(e => renderNode(e, itemClickHandler))}
      </div>
    )
  }

  if (item) {
    return (
      <div
        data-item={item.identifier}
        data-status={item.status}
        key={item.identifier}
        onClick={e => {
          e.stopPropagation()
          itemClickHandler?.({ ...e, stage: item } as any)
        }}
      >
        {item?.name}
      </div>
    )
  }

  return <div data-item="empty" />
}

jest.mock('@pipeline/components/ExecutionStageDiagram/ExecutionStageDiagram', () => {
  return function ExecutionStageDiagramMock(props: ExecutionStageDiagramProps<ExecutionNode>) {
    const { data, itemClickHandler } = props

    return <div data-testid="execution-stage-diagram-mock">{data?.items.map(e => renderNode(e, itemClickHandler))}</div>
  }
})

const contextValue: ExecutionContextParams = {
  pipelineExecutionDetail: mock.data as any,
  pipelineStagesMap: getPipelineStagesMap(mock as any),
  selectedStageId: 'qaStage',
  selectedStepId: '',
  loading: false,
  queryParams: {}
}

describe('<ExecutionGrapView /> tests', () => {
  test('renders excution graphs', () => {
    const { container } = render(
      <TestWrapper>
        <ExecutionContext.Provider value={contextValue}>
          <ExecutionGraphView />
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
          <ExecutionGraphView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )

    const stage = await findByText('qa stage2')

    fireEvent.click(stage)

    expect(getByTestId('location').innerHTML).toBe('/?stage=qaStage2')
  })

  test('stage selection does not works for "NotStarted" status', async () => {
    const { findByText, getByTestId } = render(
      <TestWrapper>
        <ExecutionContext.Provider value={contextValue}>
          <ExecutionGraphView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )

    const stage = await findByText('qa stage4')

    fireEvent.click(stage)

    expect(getByTestId('location').innerHTML).toBe('/')
  })

  test('step selection works', async () => {
    const { findByText, getByTestId } = render(
      <TestWrapper>
        <ExecutionContext.Provider value={contextValue}>
          <ExecutionGraphView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )

    const step = await findByText('http step 1')

    fireEvent.click(step)

    expect(getByTestId('location').innerHTML).toBe('/?stage=qaStage&amp;step=X_IGbTkaSMulKGh43U_xJw')
  })

  test('step selection does not works for "NotStarted" status', async () => {
    const { findByText, getByTestId } = render(
      <TestWrapper>
        <ExecutionContext.Provider value={contextValue}>
          <ExecutionGraphView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )

    const step = await findByText('http step 2')

    fireEvent.click(step)

    expect(getByTestId('location').innerHTML).toBe('/')
  })

  test('step details are shown when step is selected', async () => {
    const { container } = render(
      <TestWrapper>
        <ExecutionContext.Provider
          value={{
            ...contextValue,
            queryParams: { step: 'X_IGbTkaSMulKGh43U_xJw' },
            selectedStepId: 'X_IGbTkaSMulKGh43U_xJw'
          }}
        >
          <ExecutionGraphView />
          <NotFound />
        </ExecutionContext.Provider>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
