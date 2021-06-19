import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { testIds } from '@pipeline/components/PipelineSteps/AdvancedSteps/FailureStrategyPanel/StrategySelection/StrategyConfig'
import routes from '@common/RouteDefinitions'
import { useHandleManualInterventionInterrupt } from 'services/pipeline-ng'
import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, executionPathProps, pipelineModuleParams } from '@common/utils/routeUtils'
import { Strategy } from '@pipeline/utils/FailureStrategyUtils'
import { ManualInterventionTab } from '../ManualInterventionTab'
import data from './data.json'

const mutate = jest.fn()
jest.mock('services/pipeline-ng', () => ({
  useHandleManualInterventionInterrupt: jest.fn(() => ({ mutate }))
}))

const showError = jest.fn()
jest.mock('@common/components/Toaster/useToaster', () => ({ useToaster: jest.fn(() => ({ showError })) }))

const TEST_PATH = routes.toExecutionPipelineView({
  ...accountPathProps,
  ...executionPathProps,
  ...pipelineModuleParams
})

const pathParams = {
  accountId: 'TEST_ACCOUNT_ID',
  orgIdentifier: 'TEST_ORG',
  projectIdentifier: 'TEST_PROJECT',
  pipelineIdentifier: 'TEST_PIPELINE',
  executionIdentifier: 'TEST_EXECUTION',
  module: 'cd',
  stageId: 'selectedStageId'
}

const AllStrategies = Object.values(Strategy)

describe('<ManualInterventionTab /> tests', () => {
  beforeEach(() => {
    mutate.mockClear()
    showError.mockClear()
  })

  test('snapshot test', () => {
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams}>
        <ManualInterventionTab step={data as any} allowedStrategies={AllStrategies} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test.each(AllStrategies)('interrupt %s works', async strategy => {
    const { findByTestId } = render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams}>
        <ManualInterventionTab step={data as any} allowedStrategies={AllStrategies} />
      </TestWrapper>
    )

    const btn = await findByTestId(testIds[strategy])

    fireEvent.click(btn)

    await waitFor(() => {
      expect(mutate).toHaveBeenLastCalledWith(undefined, {
        headers: { 'content-type': 'application/json' },
        queryParams: {
          accountIdentifier: pathParams.accountId,
          interruptType: strategy,
          orgIdentifier: pathParams.orgIdentifier,
          projectIdentifier: pathParams.projectIdentifier
        }
      })
    })
  })

  test('handles error', () => {
    ;(useHandleManualInterventionInterrupt as jest.Mock).mockImplementationOnce(() => ({
      mutate,
      error: { message: 'error occured' }
    }))

    render(
      <TestWrapper path={TEST_PATH} pathParams={pathParams}>
        <ManualInterventionTab step={data as any} allowedStrategies={AllStrategies} />
      </TestWrapper>
    )

    expect(showError).toHaveBeenCalled()
  })
})
