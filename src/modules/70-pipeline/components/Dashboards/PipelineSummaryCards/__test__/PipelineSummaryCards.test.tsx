import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import PipelineSummaryCards from '../PipelineSummaryCards'

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as any),
  useRouteParams: () => ({
    params: {
      projectIdentifier: 'test'
    }
  })
}))

const healthMock = {
  data: {
    executions: {
      total: {
        count: 16,
        rate: -20.0
      },
      success: {
        percent: 81.25,
        rate: 85.71428571428571
      },
      meanInfo: {
        duration: '5522',
        rate: '5314'
      },
      medianInfo: {
        duration: '135',
        rate: '44'
      }
    }
  }
}

jest.mock('services/pipeline-ng', () => ({
  useGetPipelinedHealth: () => ({
    loading: false,
    data: healthMock
  })
}))

describe('PipelineSummaryCards', () => {
  test('shows data correctly', () => {
    const { container } = render(
      <TestWrapper>
        <PipelineSummaryCards />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
