import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import ExecutionContext, { ExecutionContextParams } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import { accountPathProps, executionPathProps, pipelineModuleParams } from '@common/utils/routeUtils'
import ExecutionStepDetails, { ExecutionStepDetailsProps } from '../ExecutionStepDetails'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => () => null)
jest.mock('services/pipeline-ng', () => ({
  useGetApprovalInstance: jest.fn(() => ({ data: {}, loading: false })),
  useGetHarnessApprovalInstanceAuthorization: jest.fn(() => ({ data: {}, loading: false })),
  useAddHarnessApprovalActivity: jest.fn(() => ({ mutate: jest.fn() }))
}))

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

const executionContext: ExecutionContextParams = {
  pipelineExecutionDetail: null,
  allNodeMap: {
    normalStep: {
      stepType: 'ShellScript',
      status: 'Success'
    },
    approvalStepWaiting: {
      stepType: 'HarnessApproval',
      status: 'Waiting'
    },
    approvalStepComplete: {
      stepType: 'JiraApproval',
      status: 'Expired'
    }
  },
  pipelineStagesMap: new Map(),
  selectedStageId: '',
  selectedStepId: '',
  loading: false,
  queryParams: {},
  logsToken: 'logsToken',
  setLogsToken: jest.fn(),
  refetch: jest.fn()
}

function TestComponent(props: ExecutionStepDetailsProps): React.ReactElement {
  return (
    <TestWrapper path={TEST_PATH} pathParams={pathParams}>
      <ExecutionContext.Provider value={executionContext}>
        <ExecutionStepDetails {...props} />
      </ExecutionContext.Provider>
    </TestWrapper>
  )
}

describe('<ExecutionStepDetails /> tests', () => {
  test('renders normal step', () => {
    const { container } = render(<TestComponent selectedStep="normalStep" closeDetails={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })

  test('renders approval waiting step', () => {
    const { container } = render(<TestComponent selectedStep="approvalStepWaiting" closeDetails={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })

  test('renders approval complete step', () => {
    const { container } = render(<TestComponent selectedStep="approvalStepComplete" closeDetails={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})
