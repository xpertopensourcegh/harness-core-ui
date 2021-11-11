import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import mockImport from 'framework/utils/mockImport'
import ExecutionPolicyEvaluationsView from '../ExecutionPolicyEvaluationsView'

describe('<ExecutionPolicyEvaluationsView /> tests', () => {
  test('Should render empty when governanceMetadata is null', () => {
    mockImport('@pipeline/context/ExecutionContext', {
      useExecutionContext: jest.fn()
    })
    mockImport('@governance/views/EvaluationView/EvaluationView', {
      EvaluationView: () => <div /> // eslint-disable-line react/display-name
    })

    const { container } = render(
      <TestWrapper>
        <ExecutionPolicyEvaluationsView />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render empty when governanceMetadata is not null', () => {
    mockImport('@pipeline/context/ExecutionContext', {
      useExecutionContext: () => {
        return {
          pipelineExecutionDetail: {
            pipelineExecutionSummary: {
              governanceMetadata: {}
            }
          }
        }
      }
    })
    mockImport('@governance/views/EvaluationView/EvaluationView', {
      EvaluationView: () => <div /> // eslint-disable-line react/display-name
    })

    const { container } = render(
      <TestWrapper>
        <ExecutionPolicyEvaluationsView />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})