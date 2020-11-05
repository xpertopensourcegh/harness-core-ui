import React from 'react'
import { render, fireEvent, findByText, act } from '@testing-library/react'

import { TestWrapper, prependAccountPath } from '@common/utils/testUtils'
import { routeCDPipelineExecutionPipline } from 'navigation/cd/routes'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { useHandleInterrupt } from 'services/cd-ng'

import ExecutionActions from '../ExecutionActions'

jest.mock('services/cd-ng', () => ({
  useHandleInterrupt: jest.fn(() => ({
    mutate: jest.fn()
  }))
}))

const pathParams = {
  accountId: 'TEST_ACCOUNT_ID',
  orgIdentifier: 'TEST_ORG',
  projectIdentifier: 'TEST_PROJECT',
  pipelineIdentifier: 'TEST_PIPELINE',
  executionIdentifier: 'TEST_EXECUTION'
}

describe('<ExecutionActions /> tests', () => {
  test.each<[ExecutionStatus]>([
    ['Aborted'],
    ['Error'],
    ['Expired'],
    ['Failed'],
    ['NotStarted'],
    ['Paused'],
    ['Queued'],
    ['Running'],
    ['Success'],
    ['Suspended'],
    ['Waiting']
  ])('snapshot tests "%s" status', async executionStatus => {
    const { container } = render(
      <TestWrapper path={routeCDPipelineExecutionPipline.path} pathParams={pathParams}>
        <ExecutionActions params={pathParams} executionStatus={executionStatus} refetch={jest.fn()} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot('container')

    const btn = container.querySelector('[icon="more"]')?.closest('button')

    fireEvent.click(btn!)

    await findByText(document.body, 'Edit Pipeline')

    expect(document.body.querySelector('.bp3-menu')).toMatchSnapshot('Menu')
  })

  test.each<[ExecutionStatus, string, string]>([
    ['Paused', 'play', 'Resume'],
    ['Running', 'pause', 'Pause'],
    ['Running', 'stop', 'Abort']
  ])('Interrupt "%s" status  with action "%s"', async (executionStatus, icon, interruptType) => {
    const mutate = jest.fn()
    ;(useHandleInterrupt as jest.Mock).mockImplementation(() => ({
      mutate,
      loading: true,
      data: null
    }))
    const { container } = render(
      <TestWrapper path={prependAccountPath(routeCDPipelineExecutionPipline.path)} pathParams={pathParams}>
        <ExecutionActions params={pathParams} executionStatus={executionStatus} refetch={jest.fn()} />
      </TestWrapper>
    )

    const btn = container.querySelector(`[icon="${icon}"]`)?.closest('button')

    act(() => {
      fireEvent.click(btn!)
    })

    expect(mutate).toHaveBeenCalledWith(
      {},
      {
        queryParams: {
          accountIdentifier: pathParams.accountId,
          orgIdentifier: pathParams.orgIdentifier,
          projectIdentifier: pathParams.projectIdentifier,
          interruptType
        }
      }
    )

    // await findByText(document.body, 'Edit Pipeline')
  })
})
